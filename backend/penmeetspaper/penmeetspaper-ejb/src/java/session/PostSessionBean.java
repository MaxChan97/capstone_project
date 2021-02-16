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
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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
    }
    
    @Override
    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException {
        Person person = em.find(Person.class, personId);
        List<Post> posts = person.getPosts();
        for (Post p : posts) {
            em.detach(p.getAuthor());
            p.getAuthor().setPosts(null);
        }
        return posts;
    }
}
