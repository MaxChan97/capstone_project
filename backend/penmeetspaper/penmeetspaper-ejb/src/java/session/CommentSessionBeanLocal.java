/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Comment;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author Shawn
 */
@Local
public interface CommentSessionBeanLocal {

    public final static String MISSING_COMMENT = "Missing comment parameter";
    public final static String INVALID_CREDENTIALS = "Incorrect credentials to modify Comment";
    public final static String COMMENT_ALREADY_DELETED = "Comment has already been deleted";

    public final static String MISSING_PERSON_ID = "Missing person id";
    public final static String MISSING_POST_ID = "Missing post id";
    public final static String MISSING_COMMENT_ID = "Missing comment id";

    public final static String CANNOT_FIND_PERSON = "Cannot find person";
    public final static String CANNOT_FIND_POST = "Cannot find post";
    public final static String CANNOT_FIND_COMMENT = "Cannot find comment";

    public Comment getComment(Long commentId) throws NoResultException, NotValidException;

    public void createCommentForPost(Long personId, Long postId, Comment comment) throws NoResultException, NotValidException;

    public void updateComment(Comment comment, Long personId) throws NoResultException, NotValidException;

    public void deleteComment(Long commentId, Long personId) throws NoResultException, NotValidException;

    public void likeComment(Long commentId, Long personId) throws NoResultException, NotValidException;

    public void unlikeComment(Long commentId, Long personId) throws NoResultException, NotValidException;

    public void deleteComment(Long commentId) throws NoResultException, NotValidException;

    public Comment getCommentById(Long commentId) throws NoResultException, NotValidException;

}
