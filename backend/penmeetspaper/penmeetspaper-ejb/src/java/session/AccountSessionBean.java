/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author carlc
 */
@Stateless
public class AccountSessionBean implements AccountSessionBeanLocal {

  @PersistenceContext
  private EntityManager em;

  @Override
  public Person login(String username, String password) throws NoResultException, NotValidException {
    if (username == null) {
      throw new NotValidException(AccountSessionBeanLocal.MISSING_USERNAME);
    }

    if (password == null) {
      throw new NotValidException(AccountSessionBeanLocal.MISSING_PASSWORD);
    }

    Query q;
    q = em.createQuery("SELECT p from Person p WHERE p.username = :username AND p.password = :password");
    q.setParameter("username", username);
    q.setParameter("password", password);

    try {
      Person p = (Person) q.getSingleResult();
      return p;
    } catch (Exception e) {
      throw new NotValidException(AccountSessionBeanLocal.INVALID_CREDENTIALS);
    }

  }
}
