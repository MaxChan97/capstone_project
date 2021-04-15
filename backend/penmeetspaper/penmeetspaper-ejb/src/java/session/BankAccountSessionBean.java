/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.BankAccount;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SHAWN LIM
 */
@Stateless
public class BankAccountSessionBean implements BankAccountSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @Override
    public BankAccount createBankAccount(BankAccount ba) {
        em.persist(ba);
        em.flush();

        return ba;
    }
}
