/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.BankAccount;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface BankAccountSessionBeanLocal {

    public final static String MISSING_BANKACCOUNT_ID = "Missing bankaccount Id";
    public final static String CANNOT_FIND_BANKACCOUNT = "Cannot find bank account";

    public BankAccount createBankAccount(BankAccount ba);

    public void updateBankAccount(BankAccount bankAccount) throws NoResultException, NotValidException;

}
