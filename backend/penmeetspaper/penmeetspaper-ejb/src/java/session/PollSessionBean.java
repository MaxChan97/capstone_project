/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.PersonAnswer;
import entity.Poll;
import entity.Person;
import exception.NotValidException;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Max
 */
@Stateless
public class PollSessionBean implements PollSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Poll createPoll(Poll newPoll) {
        em.persist(newPoll);
        return newPoll;
    }

    @Override
    public void voteOnPoll(Long personId, Long pollId, String optionVoted) throws NotValidException {
        Poll poll = em.find(Poll.class, pollId);
        Person person = em.find(Person.class, personId);

        if (poll == null) {
            throw new NotValidException("Poll does not exist");
        }

        if (person == null) {
            throw new NotValidException("Person does not exist");
        }

        if (poll.getOptions().containsKey(optionVoted)) {
            PersonAnswer oldPersonAnswer = poll.getOptions().get(optionVoted);
            oldPersonAnswer.getAnsweredBy().add(person);
            oldPersonAnswer.setNumAnswered(oldPersonAnswer.getNumAnswered() + 1);
            poll.getPollers().add(person);
        } else {
            throw new NotValidException("This poll option does not exist");
        }
    }
}
