/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.PersonAnswer;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Max
 */
@Stateless
public class PersonAnswerSessionBean implements PersonAnswerSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;
    
    @Override
    public PersonAnswer createPersonAnswer(PersonAnswer newPersonAnswer) {
        em.persist(newPersonAnswer);
        return newPersonAnswer;
    }
}
