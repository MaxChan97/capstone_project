/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import entity.Post;
import entity.personEntities.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Shawn
 */
@Stateless
public class CommentSessionBean implements CommentSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    // Helper methods to check and retrieve entities
    private Post emGetPost(Long postId) throws NoResultException, NotValidException {
        if (postId == null) {
            throw new NotValidException(CommentSessionBeanLocal.MISSING_POST_ID);
        }

        Post post = em.find(Post.class, postId);

        if (post == null) {
            throw new NoResultException(CommentSessionBeanLocal.CANNOT_FIND_POST);
        }

        return post;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(CommentSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(CommentSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    @Override
    public void createCommentForPost(Long personId, Long postId, Comment comment) throws NoResultException,
            NotValidException {
        if (comment == null) {
            throw new NotValidException(CommentSessionBeanLocal.MISSING_COMMENT);
        }

        Post post = emGetPost(postId);
        Person person = emGetPerson(personId);

        comment.setAuthor(person);

        em.persist(comment);

        post.getComments().add(comment);
    }
}
