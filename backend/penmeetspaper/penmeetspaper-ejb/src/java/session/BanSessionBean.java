/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.personEntities.Person;
import entity.personToPersonEntities.Ban;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author shawn
 */
@Stateless
public class BanSessionBean implements BanSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    private PersonSessionBeanLocal personSB;

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(BanSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(BanSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Community emGetCommunity(Long communityId) throws NoResultException, NotValidException {
        if (communityId == null) {
            throw new NotValidException(BanSessionBeanLocal.MISSING_COMMUNITY_ID);
        }

        Community community = em.find(Community.class, communityId);

        if (community == null) {
            throw new NoResultException(BanSessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }

        return community;
    }

    @Override
    public Ban createBan() {
        Ban ban = new Ban();
        em.persist(ban);
        em.flush();
        return ban;
    }

    @Override
    public void addCommuntiyBan(Long communityId, Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        Community community = emGetCommunity(communityId);

        List<Person> banList = community.getBan().getBanList();

        if (banList.contains(person)) {
            throw new NotValidException(BanSessionBeanLocal.PERSON_ALREADY_BANNED);
        }

        banList.add(person);
    }

    @Override
    public void removeCommuntiyBan(Long communityId, Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        Community community = emGetCommunity(communityId);

        List<Person> banList = community.getBan().getBanList();

        if (!banList.contains(person)) {
            throw new NotValidException(BanSessionBeanLocal.PERSON_NOT_BANNED);
        }

        banList.remove(person);
    }

    @Override
    public void addPersonBan(Long personBanningId, Long personToBanId) throws NoResultException, NotValidException {
        Person personBanning = emGetPerson(personBanningId);
        Person personToBan = emGetPerson(personToBanId);

        List<Person> banList = personBanning.getBan().getBanList();

        if (banList.contains(personToBan)) {
            throw new NotValidException(BanSessionBeanLocal.PERSON_ALREADY_BANNED);
        }

        banList.add(personToBan);
    }

    @Override
    public void removePersonBan(Long personBanningId, Long personToUnBanId) throws NoResultException, NotValidException {
        Person personBanning = emGetPerson(personBanningId);
        Person personToUnBan = emGetPerson(personToUnBanId);

        List<Person> banList = personBanning.getBan().getBanList();

        if (!banList.contains(personToUnBan)) {
            throw new NotValidException(BanSessionBeanLocal.PERSON_ALREADY_BANNED);
        }

        banList.remove(personToUnBan);
    }

    @Override
    public Ban getDetachedBan(Long banId) throws NoResultException, NotValidException {
        Ban b = em.find(Ban.class, banId);
        em.detach(b);
        List<Person> banList = b.getBanList();

        for (Person p : banList) {
            p = personSB.getPersonById(p.getId());
        }

        return b;

    }
}
