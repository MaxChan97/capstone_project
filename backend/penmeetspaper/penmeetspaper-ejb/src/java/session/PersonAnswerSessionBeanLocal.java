/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.PersonAnswer;
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface PersonAnswerSessionBeanLocal {
    public PersonAnswer createPersonAnswer(PersonAnswer newPersonAnswer);
}
