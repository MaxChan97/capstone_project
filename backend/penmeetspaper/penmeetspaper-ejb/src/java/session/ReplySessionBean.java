/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import entity.Person;
import entity.Reply;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.List;
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
public class ReplySessionBean implements ReplySessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    private PersonSessionBeanLocal personSB;

    // Helper methods to check and retrieve entities
    private Reply emGetReply(Long replyId) throws NoResultException, NotValidException {
        if (replyId == null) {
            throw new NotValidException(ReplySessionBeanLocal.MISSING_REPLY_ID);
        }

        Reply reply = em.find(Reply.class, replyId);

        if (reply == null) {
            throw new NoResultException(ReplySessionBeanLocal.CANNOT_FIND_REPLY);
        }

        return reply;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(ReplySessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(ReplySessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Comment emGetComment(Long commentId) throws NoResultException, NotValidException {
        if (commentId == null) {
            throw new NotValidException(ReplySessionBeanLocal.MISSING_COMMENT_ID);
        }

        Comment comment = em.find(Comment.class, commentId);

        if (comment == null) {
            throw new NoResultException(ReplySessionBeanLocal.CANNOT_FIND_COMMENT);
        }

        return comment;
    }

    private void checkReplyCredentials(Reply reply, Long personId) throws NotValidException {
        if (!Objects.equals(reply.getAuthor().getId(), personId)) {
            throw new NotValidException(ReplySessionBeanLocal.INVALID_CREDENTIALS);
        }
    }

    private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
        Person person = emGetPerson(p.getId());
        Person res = new Person();
        res.setUsername(person.getUsername());
        res.setId(person.getId());
        return res;
    }

    private ArrayList<Person> getDetachedLikes(List<Person> likes) {
        int size = likes.size();
        ArrayList<Person> res = new ArrayList();
        for (int i = 0; i < size; i++) {
            res.add(new Person());
        }
        return res;
    }

    @Override
    public Reply getReply(Long replyId) throws NoResultException, NotValidException {
        return emGetReply(replyId);
    }

    @Override
    public Reply getReplyById(Long replyId) throws NoResultException, NotValidException {
        Reply r = emGetReply(replyId);
        em.detach(r);

        r.setLikes(getDetachedLikes(r.getLikes()));
        r.setAuthor(getDetachedPerson(r.getAuthor()));
        return r;
    }

    @Override
    public void createReplyForComment(Long personId, Long commentId, Reply reply) throws NoResultException,
            NotValidException {

        if (reply == null) {
            throw new NotValidException(ReplySessionBeanLocal.MISSING_REPLY);
        }

        Comment comment = emGetComment(commentId);
        Person person = emGetPerson(personId);

        reply.setAuthor(person);

        em.persist(reply);

        comment.getReplies().add(reply);

        personSB.addContributorPointsToPerson(personId, 1.0);
        personSB.checkBadgeQualification(personId);
        em.flush();
    }

    @Override
    public void updateReply(Reply reply, Long personId) throws NoResultException, NotValidException {

        if (reply == null) {
            throw new NotValidException(ReplySessionBeanLocal.MISSING_REPLY);
        }

        Reply oldreply = emGetReply(reply.getId());

        checkReplyCredentials(oldreply, personId);

        oldreply.setBody(reply.getBody());
        em.flush();
    }

    @Override
    public void deleteReply(Long replyId, Long personId) throws NoResultException, NotValidException {

        Reply reply = emGetReply(replyId);

        if (reply.getAuthor() == null) {
            throw new NotValidException(ReplySessionBeanLocal.REPLY_ALREADY_DELETED);
        }

        checkReplyCredentials(reply, personId);

        reply.setBody("Reply Deleted");
        reply.setAuthor(null);
    }

    @Override
    public void likeReply(Long replyId, Long personId) throws NoResultException, NotValidException {
        Reply reply = emGetReply(replyId);
        Person person = emGetPerson(personId);

        if (reply.getLikes().contains(person)) {
            return;
        }

        reply.getLikes().add(person);
    }

    @Override
    public void unlikeReply(Long replyId, Long personId) throws NoResultException, NotValidException {
        Reply reply = emGetReply(replyId);
        Person person = emGetPerson(personId);

        if (!reply.getLikes().contains(person)) {
            return;
        }

        reply.getLikes().remove(person);
    }

    @Override
    public void deleteReply(Long replyId) throws NoResultException, NotValidException {

        Reply reply = emGetReply(replyId);

        reply.setBody("Reply Deleted By Admin");
        reply.setAuthor(null);
    }

}
