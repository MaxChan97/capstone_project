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

    public final static String INVALID_CREDENTIALS = "Incorrect credentials to modify Post";
    public final static String MISSING_POST = "Missing post parameter";

    public final static String MISSING_POST_ID = "Missing post ID";
    public final static String MISSING_PERSON_ID = "Missing person ID";
    public final static String MISSING_COMMUNITY_ID = "Missing Community ID";

    public final static String CANNOT_FIND_PERSON = "Could not find person";
    public final static String CANNOT_FIND_COMMUNITY = "Could not find community";
    public final static String CANNOT_FIND_POST = "Could not find post";

    public void createPostForPerson(Long personId, Post post) throws NoResultException, NotValidException;

    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException;

    public List<Person> searchPostByTitle(String title);

    public void updatePost(Post post) throws NoResultException, NotValidException;

    public void createPostForCommunity(Post post, Long personId, Long communityId) throws NoResultException, NotValidException;

    public void unlikePost(Long postId, Long personId) throws NoResultException, NotValidException;

    public void likePost(Long postId, Long personId) throws NoResultException, NotValidException;

    public Post getPostById(Long postId) throws NoResultException, NotValidException;

    public Post getPostById(Long postId, boolean withCommunity) throws NoResultException, NotValidException;

    public void checkPostCredentials(Long postId, Long personId) throws NotValidException, NoResultException;

    public void deletePostForPerson(Long postId) throws NoResultException, NotValidException;

    public void deletePostForCommunity(Long postId) throws NoResultException, NotValidException;

}
