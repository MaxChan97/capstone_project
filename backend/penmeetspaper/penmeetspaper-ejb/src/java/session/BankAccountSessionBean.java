/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.BankAccount;
import entity.Person;
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

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    @Override
    public BankAccount createBankAccount(BankAccount ba, Long personId) throws NoResultException, NotValidException {
        Person p = emGetPerson(personId);
        p.setBankAccount(ba);
        em.persist(ba);
        em.flush();

        return ba;
    }

    public BankAccount getBankAccountById(Long baId) throws NoResultException, NotValidException {
        return emGetBankAccount(baId);
    }

    @Override
    public void updateBankAccount(BankAccount bankAccount) throws NoResultException, NotValidException {
        BankAccount oldAccount = emGetBankAccount(bankAccount.getId());
        oldAccount.setAccountNumber(bankAccount.getAccountNumber());
        oldAccount.setBankEnum(bankAccount.getBankEnum());
        oldAccount.setDisplayName(bankAccount.getDisplayName());

        em.flush();
    }

    @Override
    public void deleteBankAccount(Long personId) throws NoResultException, NotValidException {
        Person p = emGetPerson(personId);
        BankAccount b = p.getBankAccount();
        p.setBankAccount(null);
        em.remove(b);

        em.flush();
    }
}
