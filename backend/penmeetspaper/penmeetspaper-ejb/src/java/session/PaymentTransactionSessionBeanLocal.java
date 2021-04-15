/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.PaymentTransaction;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface PaymentTransactionSessionBeanLocal {

    public final static String MISSING_ID = "Missing payment transaction Id";
    public final static String CANNOT_FIND_PAYMENT_TRANSACTION = "Cannot find payment transaction";

    public PaymentTransaction createPaymentTransaction(PaymentTransaction pay, Long personRecievingId, Long personPayingId) throws NoResultException, NotValidException;

}
