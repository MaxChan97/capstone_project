/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LivePoll;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface LivePollSessionBeanLocal {

    public LivePoll createLivePoll(LivePoll newLivePoll);

    public void voteOnLivePoll(Long personId, Long livePollId, String optionVoted) throws NotValidException;
}
