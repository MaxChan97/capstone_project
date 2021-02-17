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
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface PostSessionBeanLocal {

    public final static String MISSING_POST = "Missing post parameter";
    public final static String CANNOT_FIND_POST = "Could not find post";
    public final static String INVALID_CREDENTIALS = "Incorrect credentials";

    public void createPostForPerson(Long personId, Post post) throws NoResultException, NotValidException;

    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException;

    public List<Person> searchPostByTitle(String title);

    public void updatePost(Post post, Long personId) throws NoResultException, NotValidException;

}
