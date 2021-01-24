/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import exception.NoResultException;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author carlc
 */
@Stateless
public class PersonSessionBean implements PersonSessionBeanLocal {
  
  @PersistenceContext
  private EntityManager em;
  
  @Override
  public void createPerson(Person p) {
    System.out.println(p.getUsername());
    em.persist(p);
  } //end createPerson
  
  @Override
  public List<Person> searchPerson(String username) {
    Query q;
    if (username != null) {
      q = em.createQuery("SELECT p FROM Person p WHERE "
              + "LOWER(p.username) LIKE :username");
      q.setParameter("username", "%" + username.toLowerCase() + "%");
    } else {
      q = em.createQuery("SELECT p FROM Person p");
    }
    return q.getResultList();
  } //end searchPerson
  
  @Override
  public Person getPerson(Long pId) throws NoResultException {
    Person person = em.find(Person.class, pId);

    if (person != null) {
      return person;
    } else {
      throw new NoResultException("Not found");
    }
  } //end getPerson

}
