/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import exception.NoResultException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface PersonSessionBeanLocal {

  public Person getPerson(Long pId) throws NoResultException;

  public void createPerson(Person p);

  public List<Person> searchPerson(String username);
  
}
