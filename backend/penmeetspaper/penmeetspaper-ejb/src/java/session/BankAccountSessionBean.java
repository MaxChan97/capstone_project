/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.BankAccount;
import exception.NoResultException;
import exception.NotValidException;
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

    private BankAccount emGetBankAccount(Long accountId) throws NoResultException, NotValidException {
        if (accountId == null) {
            throw new NotValidException(BankAccountSessionBeanLocal.MISSING_BANKACCOUNT_ID);
        }

        BankAccount ba = em.find(BankAccount.class, accountId);

        if (ba == null) {
            throw new NoResultException(BankAccountSessionBeanLocal.CANNOT_FIND_BANKACCOUNT);
        }

        return ba;
    }

    @Override
    public BankAccount createBankAccount(BankAccount ba) {
        em.persist(ba);
        em.flush();

        return ba;
    }

    @Override
    public void updateBankAccount(BankAccount bankAccount) throws NoResultException, NotValidException {
        BankAccount oldAccount = emGetBankAccount(bankAccount.getId());
        oldAccount.setAccountNumber(bankAccount.getAccountNumber());
        oldAccount.setBankEnum(bankAccount.getBankEnum());
        oldAccount.setDisplayName(bankAccount.getDisplayName());

        em.flush();
    }
}
