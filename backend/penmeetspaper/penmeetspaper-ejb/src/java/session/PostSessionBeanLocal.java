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

    public void createPostForPerson(Long personId, Post post) throws NoResultException, NotValidException;

    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException;

    public List<Person> searchPostByTitle(String title);

}
