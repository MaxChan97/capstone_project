/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Ban;
import entity.Community;
import entity.Person;
import entity.Post;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
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

  @EJB
  private BanSessionBeanLocal banSB;

  private Person getDetachedPerson(Person p) throws NoResultException, NotValidException {
    return personSB.getPersonById(p.getId());
  }

  private Post getDetachedPost(Post p) throws NoResultException, NotValidException {
    return postSB.getPostById(p.getId());
  }

  private Post getDetachedCommunityPost(Post p, boolean withCommuinity) throws NoResultException, NotValidException {
    return postSB.getPostById(p.getId(), withCommuinity);
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
    Ban ban = banSB.createBan();

    community.setOwner(owner);
    community.getMembers().add(owner);
    community.setBan(ban);
    community.setDateCreated(new Date());

    em.persist(community);
    owner.getOwnedCommunities().add(community);
    em.flush();
    return community;
  }

  // Search Community
  @Override
  public List<Community> searchCommunityByName(String name) throws NoResultException, NotValidException {
    Query q;
    if (name != null) {
      q = em.createQuery("SELECT c FROM Community c WHERE "
              + "LOWER(c.name) LIKE :name");
      q.setParameter("name", "%" + name.toLowerCase() + "%");
    } else {
      q = em.createQuery("SELECT c FROM Community c");
    }

    List<Community> comms = q.getResultList();

    for (Community c : comms) {
      c = getCommunityById(c.getId());
    }

    return comms;
  } // end of searchCommunityByName

  @Override
  public List<Community> getTopCommunities() throws NoResultException, NotValidException {
    Query q;
    q = em.createQuery("SELECT c FROM Community c");

    List<Community> comms = q.getResultList();
    for (Community c : comms) {
      c = getCommunityById(c.getId());
    }
    comms.sort((c1, c2) -> c2.getMembers().size() - c1.getMembers().size());
    return comms.subList(0, Math.min(4, comms.size()));
  } // end of getTopCommunities

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
    oldCommunity.setCommunityBanner(community.getCommunityBanner());
  } // end of updateCommunity

  @Override
  public Community getCommunityById(Long communityId) throws NoResultException, NotValidException {
    Community community = emGetCommunity(communityId);

    em.detach(community);
    em.detach(community.getOwner());

    Person owner = community.getOwner();

    community.setOwner(getDetachedPerson(owner));

    List<Post> posts = community.getPosts();

    for (Post p : posts) {

      p = getDetachedCommunityPost(p, false);

    }

    List<Person> members = community.getMembers();

    for (Person p : members) {
      p = getDetachedPerson(p);
    }

    Ban ban = community.getBan();
    em.detach(ban);

    community.setBan(banSB.getDetachedBan(ban.getId()));

    return community;

  }

  @Override
  public Community getCommunityByIdForPost(Long communityId) throws NoResultException, NotValidException {
    Community community = emGetCommunity(communityId);

    em.detach(community);
    community.setOwner(null);
    community.setPosts(null);
    community.setMembers(null);
    community.setBan(null);

    return community;
  }

  @Override
  public Community getCommunity(Long communityId, Long personId) throws NoResultException, NotValidException {
    checkBanned(communityId, personId);

    return getCommunityById(communityId);
  }

  @Override
  public void followCommunity(Long communityId, Long personId) throws NoResultException, NotValidException {
    checkBanned(communityId, personId);

    Community community = emGetCommunity(communityId);
    Person person = emGetPerson(personId);

    List<Person> members = community.getMembers();
    List<Community> followingCommunity = person.getFollowingCommunities();

    if (members.contains(person) && followingCommunity.contains(community)) {
      // Person already following the community
      throw new NotValidException(CommunitySessionBeanLocal.ALREADY_FOLLOWING);
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
      // Person already unfollowed the community
      throw new NotValidException(CommunitySessionBeanLocal.ALREADY_UNFOLLOWING);
    }

    members.remove(person);
    followingCommunity.remove(community);
  }
  // Delete Community

  @Override
  public List<Person> getMembers(Long communityId) throws NoResultException, NotValidException {
    Community community = emGetCommunity(communityId);
    List<Person> members = community.getMembers();

    for (Person m : members) {
      m = getDetachedPerson(m);
    }

    return members;

  }

  @Override
  public void banPerson(Long communityId, Long personId, Long ownerId) throws NoResultException, NotValidException {
    Community community = emGetCommunity(communityId);
    Person person = emGetPerson(personId);

    if (!Objects.equals(community.getOwner().getId(), ownerId)) {
      throw new NotValidException(CommunitySessionBeanLocal.INVALID_CREDENTIALS);
    }

    if (Objects.equals(personId, ownerId)) {
      throw new NotValidException(CommunitySessionBeanLocal.CANNOT_BAN_OWNER);
    }

    Ban ban = community.getBan();

    List<Person> banList = ban.getBanList();

    if (banList.contains(person)) {
      throw new NotValidException(CommunitySessionBeanLocal.ALREADY_BANNED);
    }

    if (community.getMembers().contains(person)) {
      unfollowCommunity(communityId, personId);
    }

    banList.add(person);
    int numBan = ban.getNumBan();
    ban.setNumBan(numBan++);
    em.flush();
  } // end banPerson

  @Override
  public void unbanPerson(Long communityId, Long personId, Long ownerId) throws NoResultException, NotValidException {
    Community community = emGetCommunity(communityId);
    Person person = emGetPerson(personId);

    if (!Objects.equals(community.getOwner().getId(), ownerId)) {
      throw new NotValidException(CommunitySessionBeanLocal.INVALID_CREDENTIALS);
    }

    if (Objects.equals(personId, ownerId)) {
      throw new NotValidException(CommunitySessionBeanLocal.CANNOT_BAN_OWNER);
    }

    Ban ban = community.getBan();

    List<Person> banList = ban.getBanList();

    if (!banList.contains(person)) {
      throw new NotValidException(CommunitySessionBeanLocal.ALREADY_UNBANNED);
    }

    banList.remove(person);
    int numBan = ban.getNumBan();
    ban.setNumBan(numBan--);
    em.flush();
  }

  @Override
  public List<Person> getBannedUsers(Long communityId) throws NoResultException, NotValidException {
    Community c = emGetCommunity(communityId);
    List<Person> banList = c.getBan().getBanList();

    for (Person p : banList) {
      p = getDetachedPerson(p);
    }

    return banList;
  }

  @Override
  public void checkBanned(Long communityId, Long personId) throws NotValidException, NoResultException {
    Community c = emGetCommunity(communityId);
    Person p = emGetPerson(personId);

    List<Person> banList = c.getBan().getBanList();
    if (banList.contains(p)) {
      throw new NotValidException(CommunitySessionBeanLocal.BANNED);
    }
  }

  @Override
  public void deleteCommunity(Long communityId) throws NotValidException, NoResultException {
    Community c = emGetCommunity(communityId);

    System.out.println(c.getId());

    List<Post> posts = c.getPosts();
    List<Long> copy = new ArrayList();

    for (Post p : posts) {
      copy.add(p.getId());
    }

    for (Long postId : copy) {
      postSB.deletePostForCommunity(postId);
    }

    c.setPosts(null);

    List<Person> members = c.getMembers();

    for (Person p : members) {
      p.getFollowingCommunities().remove(c);
    }

    c.setMembers(null);

    Person owner = c.getOwner();
    owner.getOwnedCommunities().remove(c);
    c.setOwner(null);

    em.remove(c);
    em.flush();
  }

}
