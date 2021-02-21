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

    public final static String MISSING_PERSON_ID = "Missing person id";
    public final static String MISSING_COMMENT = "Missing comment parameter";
    public final static String MISSING_POST_ID = "Missing post id";
    public final static String CANNOT_FIND_PERSON = "Cannot find person";
    public final static String CANNOT_FIND_POST = "Cannot find person";

    public void createCommentForPost(Long personId, Long postId, Comment comment) throws NoResultException, NotValidException;

}
