/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.BankAccount;
import javax.ejb.Local;

/**
 *
 * @author SHAWN LIM
 */
@Local
public interface BankAccountSessionBeanLocal {

    public BankAccount createBankAccount(BankAccount ba);

}
