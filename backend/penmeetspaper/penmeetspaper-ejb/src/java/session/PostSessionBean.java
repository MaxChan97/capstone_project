/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
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

    // Helper methods to check and retrieve entities
    private Post emGetPost(Long postId) throws NoResultException, NotValidException {
        if (postId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST_ID);
        }

        Post post = em.find(Post.class, postId);

        if (post == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_POST);
        }

        return post;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Community emGetCommunity(Long communityId) throws NoResultException, NotValidException {
        if (communityId == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_COMMUNITY_ID);
        }

        Community community = em.find(Community.class, communityId);

        if (community == null) {
            throw new NoResultException(PostSessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }

        return community;
    }

    // Main logic
    @Override
    public void createPostForPerson(Long personId, Post post) throws NoResultException, NotValidException {

        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Person poster = emGetPerson(personId);

        post.setAuthor(poster);

        em.persist(post);
        poster.getPosts().add(post);
    } // end createPostForPerson

    @Override
    public void createPostForCommunity(Post post, Long personId, Long communityId)
            throws NoResultException, NotValidException {
        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Person person = emGetPerson(personId);
        Community community = emGetCommunity(communityId);

        post.setAuthor(person);
        post.setPostCommunity(community);

        em.persist(post);
        person.getPosts().add(post);
        community.getPosts().add(post);
    }

    @Override
    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Post> posts = person.getPosts();
        for (Post p : posts) {
            em.detach(p.getAuthor());
            p.getAuthor().setPosts(null);
            p.getAuthor().setChats(null);
        }
        return posts;
    } // end getPersonsPost

    @Override
    public List<Person> searchPostByTitle(String title) {
        Query q;
        if (title != null) {
            q = em.createQuery("SELECT p FROM Post p WHERE " + "LOWER(p.title) LIKE :title");
            q.setParameter("title", "%" + title.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Post p");
        }
        return q.getResultList();
    } // end searchPostByTitle

    @Override
    public void updatePost(Post post, Long personId) throws NoResultException, NotValidException {
        if (post == null) {
            throw new NotValidException(PostSessionBeanLocal.MISSING_POST);
        }

        Post oldPost = emGetPost(post.getId());

        if (!Objects.equals(oldPost.getAuthor().getId(), personId)) {
            throw new NotValidException(PostSessionBeanLocal.INVALID_CREDENTIALS);
        }

        oldPost.setTitle(post.getTitle());
        oldPost.setBody(post.getBody());

    } // end updatePost

    @Override
    public void deletePostForPerson(Long postId, Long personId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = emGetPerson(personId);

        if (!Objects.equals(post.getAuthor().getId(), personId)) {
            throw new NotValidException(PostSessionBeanLocal.INVALID_CREDENTIALS);
        }

        // unlinking
        person.getPosts().remove(post);
        post.setAuthor(null);

        em.remove(post);
    }

    @Override
    public void likePost(Long postId, Long personId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = emGetPerson(personId);

        if (post.getLikes().contains(person) && person.getLikedPosts().contains(post)) {
            return;
        }

        post.getLikes().add(person);
        person.getLikedPosts().add(post);
    }

    @Override
    public void unlikePost(Long postId, Long personId) throws NoResultException, NotValidException {
        Post post = emGetPost(postId);
        Person person = emGetPerson(personId);

        if (!post.getLikes().contains(person) && !person.getLikedPosts().contains(post)) {
            return;
        }

        post.getLikes().remove(person);
        person.getLikedPosts().remove(post);
    }

}
