/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Poll;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface PollSessionBeanLocal {
    
    public Poll createPoll(Poll newPoll);
    
    public void voteOnPoll(Long personId, Long pollId, String optionVoted) throws NotValidException;
    
}
