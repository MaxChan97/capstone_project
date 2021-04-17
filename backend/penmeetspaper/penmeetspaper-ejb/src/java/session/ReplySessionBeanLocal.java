/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Reply;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author Shawn
 */
@Local
public interface ReplySessionBeanLocal {

    public final static String MISSING_REPLY = "Missing reply parameter";
    public final static String INVALID_CREDENTIALS = "Incorrect credentials to modify Comment";
    public final static String REPLY_ALREADY_DELETED = "Reply has already been deleted";

    public final static String MISSING_PERSON_ID = "Missing person id";
    public final static String MISSING_COMMENT_ID = "Missing comment id";
    public final static String MISSING_REPLY_ID = "Missing reply id";

    public final static String CANNOT_FIND_PERSON = "Cannot find person";
    public final static String CANNOT_FIND_COMMENT = "Cannot find comment";
    public final static String CANNOT_FIND_REPLY = "Cannot find reply";

    public Reply getReply(Long replyId) throws NoResultException, NotValidException;

    public void createReplyForComment(Long personId, Long commentId, Reply reply) throws NoResultException, NotValidException;

    public void updateReply(Reply reply, Long personId) throws NoResultException, NotValidException;

    public void deleteReply(Long replyId, Long personId) throws NoResultException, NotValidException;

    public void likeReply(Long replyId, Long personId) throws NoResultException, NotValidException;

    public void unlikeReply(Long replyId, Long personId) throws NoResultException, NotValidException;

    public void deleteReply(Long replyId) throws NoResultException, NotValidException;

    public Reply getReplyById(Long replyId) throws NoResultException, NotValidException;

}
