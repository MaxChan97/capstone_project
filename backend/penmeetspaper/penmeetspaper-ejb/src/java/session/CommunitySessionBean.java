/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.personEntities.Person;
import exception.NotValidException;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Shawn
 */
@Stateless
public class CommunitySessionBean implements CommunitySessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Community createCommunity(Community community) throws NotValidException {
        if (community == null) {
            throw new NotValidException(CommunitySessionBeanLocal.MISSING_COMMUNITY);
        }

        if (community.getName() == null) {
            throw new NotValidException(CommunitySessionBeanLocal.MISSING_NAME);
        }

        Query q;
        q = em.createQuery("Select c from Community c WHERE c.name =:name");
        q.setParameter("name", community.getName());
        if (q.getResultList().size() > 0) {
            throw new NotValidException(CommunitySessionBeanLocal.NAME_TAKEN);
        }

        Person retrivedOwner = community.getOwner();

        if (retrivedOwner == null) {
            throw new NotValidException(CommunitySessionBeanLocal.INVALID_OWNER);
        }

        Person owner = em.find(Person.class, retrivedOwner.getId());

        if (owner == null) {
            throw new NotValidException(CommunitySessionBeanLocal.INVALID_OWNER);
        }

        em.persist(community);
        owner.getOwnedCommunities().add(community);

        return community;
    }

    // Search Community 
    // Edit Community
    // Delete Community
}
