/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.Post;
import entity.personEntities.Person;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.EJB;
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

    @EJB
    private PersonSessionBeanLocal personSB;

    @EJB
    private PostSessionBeanLocal postSB;

    private Community emGetCommunity(Long communityId) throws NoResultException, NotValidException {
        if (communityId == null) {
            throw new NotValidException(CommunitySessionBeanLocal.MISSING_COMMUNITY);
        }

        Community community = em.find(Community.class, communityId);

        if (community == null) {
            throw new NoResultException(CommunitySessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }

        return community;

    }

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
    @Override
    public List<Community> searchCommunityByName(String name) {
        Query q;
        if (name != null) {
            q = em.createQuery("SELECT c FROM Community c WHERE "
                    + "LOWER(c.name) LIKE :name");
            q.setParameter("name", "%" + name.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT c FROM Community c");
        }

        return q.getResultList();
    } // end of searchCommunityByName

    // Edit Community
    @Override
    public void updateCommunity(Community community) throws NoResultException, NotValidException {
        if (community == null) {
            throw new NotValidException(CommunitySessionBeanLocal.MISSING_COMMUNITY);
        }

        Community oldCommunity = em.find(Community.class, community.getId());

        if (oldCommunity == null) {
            throw new NoResultException(CommunitySessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }

        oldCommunity.setDescription(community.getDescription());
        oldCommunity.setTopicEnums(community.getTopicEnums());
        oldCommunity.setCommunityProfilePicture(community.getCommunityProfilePicture());
    } // end of updateCommunity

    @Override
    public Community getCommunityById(Long communityId) throws NoResultException, NotValidException {
        Community community = emGetCommunity(communityId);

        em.detach(community.getOwner());
        Person owner = community.getOwner();
        community.setOwner(personSB.getPersonById(owner.getId()));

        List<Post> posts = community.getPosts();

        for (Post p : posts) {

            p = postSB.getPostById(p.getId());
        }

        List<Person> members = community.getMembers();

        for (Person p : members) {
            p = personSB.getPersonById(p.getId());
        }

        return community;

    }
    // Delete Community
}
