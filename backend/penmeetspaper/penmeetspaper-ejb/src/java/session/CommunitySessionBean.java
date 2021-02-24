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

    private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
        return personSB.getPersonById(p.getId());
    }

    private Post getDetachedPost(Post p) throws NoResultException, NotValidException {
        return postSB.getPostById(p.getId());
    }

    private Community emGetCommunity(Long communityId) throws NoResultException, NotValidException {
        if (communityId == null) {
            throw new NotValidException(CommunitySessionBeanLocal.MISSING_COMMUNITY_ID);
        }

        Community community = em.find(Community.class, communityId);

        if (community == null) {
            throw new NoResultException(CommunitySessionBeanLocal.CANNOT_FIND_COMMUNITY);
        }

        return community;
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(CommunitySessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(CommunitySessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    @Override
    public Community createCommunity(Community community, Long ownerId) throws NotValidException, NoResultException {
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

        Person owner = emGetPerson(ownerId);

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

        Community oldCommunity = emGetCommunity(community.getId());

        oldCommunity.setDescription(community.getDescription());
        oldCommunity.setTopicEnums(community.getTopicEnums());
        oldCommunity.setCommunityProfilePicture(community.getCommunityProfilePicture());
    } // end of updateCommunity

    @Override
    public Community getCommunityById(Long communityId) throws NoResultException, NotValidException {
        Community community = emGetCommunity(communityId);

        em.detach(community.getOwner());
        Person owner = community.getOwner();

        community.setOwner(getDetachedPerson(owner));

        List<Post> posts = community.getPosts();

        for (Post p : posts) {

            p = getDetachedPost(p);

        }

        List<Person> members = community.getMembers();

        for (Person p : members) {
            p = getDetachedPerson(p);
        }

        return community;

    }

    @Override
    public void followCommunity(Long communityId, Long personId) throws NoResultException, NotValidException {
        Community community = emGetCommunity(communityId);
        Person person = emGetPerson(personId);

        List<Person> members = community.getMembers();
        List<Community> followingCommunity = person.getFollowingCommunities();

        if (members.contains(person) && followingCommunity.contains(community)) {
            // Person already following the community
            return;
        }

        members.add(person);
        followingCommunity.add(community);

    }

    @Override
    public void unfollowCommunity(Long communityId, Long personId) throws NoResultException, NotValidException {
        Community community = emGetCommunity(communityId);
        Person person = emGetPerson(personId);

        List<Person> members = community.getMembers();
        List<Community> followingCommunity = person.getFollowingCommunities();

        if (!members.contains(person) && !followingCommunity.contains(community)) {
            // Person already following the community
            return;
        }

        members.remove(person);
        followingCommunity.remove(community);
    }
    // Delete Community
}
