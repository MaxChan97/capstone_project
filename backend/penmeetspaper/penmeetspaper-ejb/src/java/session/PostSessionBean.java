/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Post;
import entity.personEntities.Person;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import java.util.Objects;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Max
 */
@Stateless
public class PostSessionBean implements PostSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    private PersonSessionBeanLocal personSessionLocal;

    @Override
    public void createPostForPerson(Long personId, Post post) throws NoResultException, NotValidException {
        Person poster = em.find(Person.class, personId);
        post.setAuthor(poster);

        em.persist(post);
        poster.getPosts().add(post);
    } // end createPostForPerson

    @Override
    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException {
        Person person = em.find(Person.class, personId);
        List<Post> posts = person.getPosts();
        for (Post p : posts) {
            em.detach(p.getAuthor());
            p.getAuthor().setPosts(null);
        }
        return posts;
    } // end getPersonsPost

    @Override
    public List<Person> searchPostByTitle(String title) {
        Query q;
        if (title != null) {
            q = em.createQuery("SELECT p FROM Post p WHERE "
                    + "LOWER(p.title) LIKE :title");
            q.setParameter("title", "%" + title.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Post p");
        }
        return q.getResultList();
    } //end searchPostByTitle

    @Override
    public void updatePost(Post post, Long personId) throws NoResultException, NotValidException {
        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Post oldPost = em.find(Post.class, post.getId());
        if (oldPost == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_POST);
        }
        if (!Objects.equals(oldPost.getAuthor().getId(), personId)) {
            throw new NotValidException(PostSessionBeanLocal.INVALID_CREDENTIALS);
        }

        oldPost.setTitle(post.getTitle());
        oldPost.setBody(post.getBody());

    } // end updatePost
}
