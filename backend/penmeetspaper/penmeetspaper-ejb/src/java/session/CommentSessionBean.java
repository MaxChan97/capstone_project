/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import entity.Person;
import entity.Post;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Objects;
import javax.ejb.EJB;
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

    @EJB
    private PersonSessionBeanLocal personSB;

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

    private Comment emGetComment(Long commentId) throws NoResultException, NotValidException {
        if (commentId == null) {
            throw new NotValidException(CommentSessionBeanLocal.MISSING_COMMENT_ID);
        }

        Comment comment = em.find(Comment.class, commentId);

        if (comment == null) {
            throw new NoResultException(CommentSessionBeanLocal.CANNOT_FIND_COMMENT);
        }

        return comment;
    }

    private void checkCredentials(Comment comment, Long personId) throws NotValidException {
        if (!Objects.equals(comment.getAuthor().getId(), personId)) {
            throw new NotValidException(CommentSessionBeanLocal.INVALID_CREDENTIALS);
        }
    }

    // Main Logic -------------------------------------------------------------------
    @Override
    public Comment getComment(Long commentId) throws NoResultException, NotValidException {
        return emGetComment(commentId);
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

        personSB.addContributorPointsToPerson(personId, 1.0);
        personSB.checkBadgeQualification(personId);
        em.flush();
    }

    @Override
    public void updateComment(Comment comment, Long personId) throws NoResultException, NotValidException {

        if (comment == null) {
            throw new NotValidException(CommentSessionBeanLocal.MISSING_COMMENT);
        }

        Comment oldComment = emGetComment(comment.getId());

        checkCredentials(oldComment, personId);

        oldComment.setBody(comment.getBody());
    }

    @Override
    public void deleteComment(Long commentId, Long personId) throws NoResultException, NotValidException {

        Comment commentToDelete = emGetComment(commentId);

        if (commentToDelete.getAuthor() == null) {
            throw new NotValidException(CommentSessionBeanLocal.COMMENT_ALREADY_DELETED);
        }

        checkCredentials(commentToDelete, personId);

        commentToDelete.setBody("Commment Deleted");
        commentToDelete.setAuthor(null);
    }

    @Override
    public void likeComment(Long commentId, Long personId) throws NoResultException, NotValidException {
        Comment comment = emGetComment(commentId);
        Person person = emGetPerson(personId);

        if (comment.getLikes().contains(person)) {
            return;
        }

        comment.getLikes().add(person);
    }

    @Override
    public void unlikeComment(Long commentId, Long personId) throws NoResultException, NotValidException {
        Comment comment = emGetComment(commentId);
        Person person = emGetPerson(personId);

        if (!comment.getLikes().contains(person)) {
            return;
        }

        comment.getLikes().remove(person);
    }
}
