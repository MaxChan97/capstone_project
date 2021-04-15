/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.PaymentTransaction;
import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author SHAWN LIM
 */
@Stateless
public class PaymentTransactionSessionBean implements PaymentTransactionSessionBeanLocal {

    @PersistenceContext
    EntityManager em;

    @EJB
    PersonSessionBeanLocal personSB;

    private PaymentTransaction emGetPaymentTransaction(Long ptId) throws NoResultException, NotValidException {
        if (ptId == null) {
            throw new NotValidException(PaymentTransactionSessionBeanLocal.MISSING_ID);
        }

        PaymentTransaction payment = em.find(PaymentTransaction.class, ptId);

        if (payment == null) {
            throw new NoResultException(PaymentTransactionSessionBeanLocal.CANNOT_FIND_PAYMENT_TRANSACTION);
        }

        return payment;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(ReportSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(ReportSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Person getDetachedPerson(Long personId) throws NoResultException, NotValidException {
        Person p = emGetPerson(personId);
        Person res = new Person();
        res.setUsername(p.getUsername());
        res.setId(p.getId());

        return res;
    }

    @Override
    public PaymentTransaction createPaymentTransaction(PaymentTransaction pay, Long personRecievingId, Long personPayingId) throws NoResultException, NotValidException {
        if (personRecievingId == null) {
            Person p = emGetPerson(personPayingId);
            pay.setPersonReceiving(null);
            pay.setIsPaidToUser(false);
            p.getPaymentsMade().add(pay);
        } else {
            Person p = emGetPerson(personRecievingId);
            pay.setPersonReceiving(p);
            pay.setIsPaidToUser(true);
            p.getPaymentsRecieved().add(pay);
        }

        pay.setTransactionDate(new Date());

        em.persist(pay);

        em.flush();
        return pay;
    }

    public PaymentTransaction getPaymentTransactionById(Long id) throws NoResultException, NotValidException {
        PaymentTransaction pay = emGetPaymentTransaction(id);
        em.detach(pay);

        Person personReceiving = pay.getPersonReceiving();

        if (personReceiving != null) {
            pay.setPersonReceiving(getDetachedPerson(personReceiving.getId()));
        }
        return pay;
    }
}
