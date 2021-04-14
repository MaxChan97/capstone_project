/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LivePoll;
import entity.Person;
import entity.PersonAnswer;
import exception.NotValidException;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Max
 */
@Stateless
public class LivePollSessionBean implements LivePollSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;
    
    @Override
    public LivePoll createLivePoll(LivePoll newLivePoll) {
        em.persist(newLivePoll);
        return newLivePoll;
    }
    
    @Override
    public void voteOnLivePoll(Long personId, Long livePollId, String optionVoted) throws NotValidException {
        LivePoll livePoll = em.find(LivePoll.class, livePollId);
        Person person = em.find(Person.class, personId);
        
        if (livePoll == null) {
            throw new NotValidException("Live Poll does not exist");
        }
        
        if (person == null) {
            throw new NotValidException("Person does not exist");
        }
        
        if (livePoll.getOptions().containsKey(optionVoted)) {
            PersonAnswer oldPersonAnswer = livePoll.getOptions().get(optionVoted);
            oldPersonAnswer.getAnsweredBy().add(person);
            oldPersonAnswer.setNumAnswered(oldPersonAnswer.getNumAnswered() + 1);
            livePoll.getPollers().add(person);
        } else {
            throw new NotValidException("This poll option does not exist");
        }
    }
}
