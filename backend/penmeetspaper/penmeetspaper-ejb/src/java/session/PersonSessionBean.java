/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Badge;
import entity.Ban;
import entity.Community;
import entity.Follow;
import entity.Person;
import entity.Post;
import entity.Subscription;
import enumeration.BadgeTypeEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author carlc
 */
@Stateless
public class PersonSessionBean implements PersonSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @EJB
    private BanSessionBeanLocal banSB;

    @EJB
    private BadgeSessionBeanLocal badgeSB;

    @EJB
    private CommunitySessionBeanLocal communitySB;

    @EJB
    private PostSessionBeanLocal postSB;

    private Post getDetachedPost(Post p) throws NoResultException, NotValidException {
        return postSB.getPostById(p.getId());
    }

    private Community getDetachedCommunity(Community c) throws NoResultException, NotValidException {
        return communitySB.getCommunityById(c.getId());
    }

    private Person emGetPerson(Long personId) throws NoResultException, NotValidException {
        if (personId == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON_ID);
        }

        Person person = em.find(Person.class, personId);

        if (person == null) {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        return person;
    }

    private Person emGetPersonByEmail(String email) throws NoResultException, NotValidException {
        if (email == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_EMAIL);
        }

        Query q;
        q = em.createQuery("SELECT p from Person p WHERE p.email =:email");
        q.setParameter("email", email);

        List<Person> personList = q.getResultList();

        if (personList.size() == 0) {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        for (Person p : personList) {
            p = getPersonById(p.getId());
        }

        return personList.get(0);
    }

    private Person emGetPersonByResetId(String resetId) throws NoResultException, NotValidException {
        if (resetId == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_RESET_ID);
        }

        Query q;
        q = em.createQuery("SELECT p from Person p WHERE p.resetId =:resetId");
        q.setParameter("resetId", resetId);

        List<Person> personList = q.getResultList();

        if (personList.size() == 0) {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        for (Person p : personList) {
            p = getPersonById(p.getId());
        }

        return personList.get(0);
    }

    private void checkUsernameTaken(String username, Long personId) throws NotValidException {
        Query q = em.createQuery("SELECT p from Person p WHERE p.username =:username");
        q.setParameter("username", username);
        List<Person> persons = q.getResultList();

        if (persons.size() > 0) {
            for (Person p : persons) {
                if (p.getId() != personId) {
                    throw new NotValidException(PersonSessionBeanLocal.USERNAME_TAKEN);
                }
            }
        }
    }

    private void checkUsernameTaken(String username) throws NotValidException {
        Query q = em.createQuery("SELECT p from Person p WHERE p.username =:username");
        q.setParameter("username", username);
        if (q.getResultList().size() > 0) {
            throw new NotValidException(PersonSessionBeanLocal.USERNAME_TAKEN);
        }
    }

    private void setDefaultBadge(Person person) throws NotValidException {

        Badge b1 = badgeSB.getBadgeByDisplayName("Level 1 Badge");
        List<Badge> badgeList = new ArrayList();
        badgeList.add(b1);
        person.setBadges(badgeList);
        person.setBadgeDisplaying(b1);
        em.flush();
    }

    private void generateRandomProfilePicture(Person person) {

        String[] profilePicArray = {
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb",
            "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Default%20Dp%20logo.svg?alt=media&token=8e2c7896-9e1f-4541-8934-bb00543bd9bb"};

        Random rand = new Random();
        int randomNum = rand.nextInt(profilePicArray.length);

        person.setProfilePicture(profilePicArray[randomNum]);

    }

    @Override
    public void addCCPointsToPerson(Long personId, double points) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);
        Double currCCPoints = person.getContentCreatorPoints();
        currCCPoints += points;
        person.setContentCreatorPoints(currCCPoints);
    }

    @Override
    public void addContributorPointsToPerson(Long personId, double points) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);
        Double currContributorPoints = person.getContributorPoints();
        currContributorPoints += points;
        person.setContributorPoints(currContributorPoints);
        em.flush();
    }

    @Override
    public Person createPerson(Person person) throws NotValidException {
        if (person == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON);
        }

        if (person.getUsername() == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_USERNAME);
        }

        Query q;
        q = em.createQuery("SELECT p from Person p WHERE p.email =:email");
        q.setParameter("email", person.getEmail());
        if (q.getResultList().size() > 0) {
            throw new NotValidException(PersonSessionBeanLocal.EMAIL_TAKEN);
        }

        checkUsernameTaken(person.getUsername());

        person.setCreatedDate(new Date());

        Ban ban = banSB.createBan();

        person.setBan(ban);
        person.setDescription("");
        generateRandomProfilePicture(person);
        person.setProfileBanner(
                "https://firebasestorage.googleapis.com/v0/b/bullandbear-22fad.appspot.com/o/Profile%20Banner%20Image.png?alt=media&token=e59ee28d-8388-4e81-8fd7-8d6409690897");
        person.setContentCreatorPoints(0.0);
        person.setContributorPoints(0.0);

        Badge b1 = badgeSB.getBadgeByDisplayName("Level 1 Badge");
        List<Badge> badgeList = new ArrayList();

        badgeList.add(b1);
        person.setBadges(badgeList);
        person.setBadgeDisplaying(b1);

        em.persist(person);
        em.flush();

        return person;
    } // end createPerson

    @Override
    public List<Person> searchPersonByUsername(String username) throws NoResultException, NotValidException {
        Query q;
        if (username != null) {
            q = em.createQuery("SELECT p FROM Person p WHERE " + "LOWER(p.username) LIKE :username");
            q.setParameter("username", "%" + username.toLowerCase() + "%");
        } else {
            q = em.createQuery("SELECT p FROM Person p");
        }
        List<Person> personList = q.getResultList();
        for (Person p : personList) {
            p = getPersonById(p.getId());
        }

        return personList;
    } // end searchPersonByUsername

    @Override
    // Detach methods will be here
    public Person getPersonById(Long pId) throws NoResultException, NotValidException {
        Person person = emGetPerson(pId);

        em.detach(person);
        person.setPosts(null);
        person.setChats(null);
        person.setFollowers(null);
        person.setFollowing(null);
        person.setSubscriptions(null);
        person.setPublications(null);
        person.setOwnedCommunities(null);
        person.setFollowingCommunities(null);
        person.setFollowersAnalytics(null);
        person.setSubscribersAnalytics(null);
        person.setViewersAnalytics(null);
        person.setEarningsAnalytics(null);
        person.setStreams(null);

        return person;
    } // end getPersonById

    @Override
    public Person getPersonByEmail(String email) throws NoResultException, NotValidException {
        Person person = emGetPersonByEmail(email);
        return getPersonById(person.getId());

    } // end getPersonByEmail

    @Override
    public Person getPersonByResetId(String resetId) throws NoResultException, NotValidException {
        Person person = emGetPersonByResetId(resetId);
        return getPersonById(person.getId());

    } // end getPersonByResetId

    @Override
    public void updatePerson(Person person) throws NoResultException, NotValidException {
        if (person == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON);
        }

        checkUsernameTaken(person.getUsername(), person.getId());

        Person oldPerson = em.find(Person.class, person.getId());

        if (oldPerson != null) {
            oldPerson.setUsername(person.getUsername());
            oldPerson.setPassword(person.getPassword());
            oldPerson.setDescription(person.getDescription());
            oldPerson.setDob(person.getDob());
            oldPerson.setIncomeRange(person.getIncomeRange());
            oldPerson.setTopicInterests(person.getTopicInterests());
            oldPerson.setProfilePicture(person.getProfilePicture());
            oldPerson.setProfileBanner(person.getProfileBanner());
            oldPerson.setResetId(person.getResetId());
        } else {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        em.flush();
    } // end updatePerson

    @Override
    public void updatePersonInfo(Person person) throws NoResultException, NotValidException {
        if (person == null) {
            throw new NotValidException(PersonSessionBeanLocal.MISSING_PERSON);
        }

        checkUsernameTaken(person.getUsername(), person.getId());

        Person oldPerson = em.find(Person.class, person.getId());

        if (oldPerson != null) {

            oldPerson.setChatIsPaid(person.isChatIsPaid());
            oldPerson.setHasExplicitLanguage(person.isHasExplicitLanguage());

        } else {
            throw new NoResultException(PersonSessionBeanLocal.CANNOT_FIND_PERSON);
        }

        em.flush();
    } // end updatePerson

    @Override
    public void deletePerson(Long pId) throws NoResultException, NotValidException {
        Person p = emGetPerson(pId);
        em.remove(p);
    } // end deletePerson

    @Override
    public void updatePricingPlan(Person person) throws NoResultException, NotValidException {
        Person oldPerson = emGetPerson(person.getId());

        // NEED TO ADD MORE
        oldPerson.setPricingPlan(person.getPricingPlan());
        em.flush();
    } // end updatePricingPlan

    @Override
    public void onboarding(Person person) throws NoResultException, NotValidException {
        Person oldPerson = emGetPerson(person.getId());

        oldPerson.setIncomeRange(person.getIncomeRange());
        oldPerson.setDob(person.getDob());
        oldPerson.setTopicInterests(person.getTopicInterests());
        oldPerson.setCompletedOnboarding(true);
        em.flush();
    } // end onboarding

    @Override
    public void skipOnboarding(Long personId) throws NoResultException, NotValidException {
        Person oldPerson = emGetPerson(personId);
        oldPerson.setCompletedOnboarding(true);
        em.flush();
    } // end skipOnboarding

    // Get the people this person is following
    public List<Follow> getFollowing(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Follow> following = person.getFollowing();

        for (Follow f : following) {
            em.detach(f);
            // Remove the follower (redundant)
            f.setFollower(null);

            // detaching the person entity
            Person publisher = f.getPublisher();
            f.setPublisher(getPersonById(publisher.getId()));
        }

        return following;

    }

    // Get the people following this person
    public List<Follow> getFollowers(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Follow> followers = person.getFollowers();

        for (Follow f : followers) {
            em.detach(f);
            // Remove the publisher which is personId (redundant)
            f.setPublisher(null);

            // detaching the person entity
            Person follower = f.getFollower();
            f.setFollower(getPersonById(follower.getId()));
        }

        return followers;
    }

    @Override
    // Get the people that this person is subscribed to
    public List<Subscription> getSubscription(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Subscription> subscriptions = person.getSubscriptions();

        for (Subscription s : subscriptions) {
            em.detach(s);
            // Remove the subscriber which is personId (redundant)
            s.setSubscriber(null);

            Person publisher = s.getPublisher();
            s.setPublisher(getPersonById(publisher.getId()));
        }

        return subscriptions;
    }

    @Override
    public List<Subscription> getPublications(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Subscription> publications = person.getPublications();

        for (Subscription s : publications) {
            em.detach(s);
            // Remove the publisher which is personId (redundant)
            s.setPublisher(null);

            Person subscriber = s.getSubscriber();
            s.setSubscriber(getPersonById(subscriber.getId()));
        }

        return publications;
    }

    @Override
    public List<Community> getFollowingAndOwnedCommunities(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> ownedCommunities = person.getOwnedCommunities();
        List<Community> followingCommunities = person.getFollowingCommunities();

        List<Community> result = new ArrayList();

        for (Community c : ownedCommunities) {
            result.add(getDetachedCommunity(c));
        }

        for (Community c : followingCommunities) {
            if (!result.contains(c)) {
                result.add(getDetachedCommunity(c));
            }
        }

        return result;

    }

    @Override
    public List<Community> getFollowingCommunities(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> followingCommunities = person.getFollowingCommunities();

        List<Community> result = new ArrayList();

        for (Community c : followingCommunities) {
            result.add(getDetachedCommunity(c));
        }

        return result;
    }

    @Override
    public List<Community> getOwnedCommunities(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> ownedCommunities = person.getOwnedCommunities();

        List<Community> result = new ArrayList();

        for (Community c : ownedCommunities) {
            result.add(getDetachedCommunity(c));
        }

        return result;
    }

    @Override
    public List<Post> getFollowingPosts(Long personId) throws NoResultException, NotValidException {
        List<Follow> following = getFollowing(personId);

        List<Post> results = new ArrayList();

        for (Follow f : following) {
            Person p = emGetPerson(f.getPublisher().getId());
            List<Post> posts = p.getPosts();
            results.addAll(posts);
        }

        List<Post> filterResults = new ArrayList();

        for (Post p : results) {
            if (p.getPostCommunity() == null) {
                filterResults.add(getDetachedPost(p));
            }
        }

        Collections.sort(filterResults, Collections.reverseOrder());

        return filterResults;

    }

    @Override
    public List<Post> getPersonsPost(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);

        List<Post> posts = person.getPosts();

        List<Post> results = new ArrayList();

        for (Post p : posts) {
            if (p.getPostCommunity() == null) {
                results.add(getDetachedPost(p));
            }
        }
        return results;
    }

    @Override
    public List<Post> getFollowingCommunityPosts(Long personId) throws NoResultException, NotValidException {
        Person person = emGetPerson(personId);
        List<Community> followingCommunities = person.getFollowingCommunities();
        List<Post> results = new ArrayList();

        for (Community c : followingCommunities) {
            List<Post> posts = c.getPosts();
            for (Post p : posts) {
                results.add(postSB.getPostById(p.getId(), true));
            }
        }

        Collections.sort(results, Collections.reverseOrder());

        return results;
    }

    @Override
    public List<Person> getTopTenContributors() throws NoResultException, NotValidException {
        Query q = em.createQuery("SELECT p FROM Person p");
        List<Person> personList = q.getResultList();

        if (personList.isEmpty()) {
            throw new NoResultException(PersonSessionBeanLocal.EMPTY_PERSON);
        }

        Collections.sort(personList, (Person p1, Person p2) -> {
            double p1Points = p1.getContributorPoints();
            double p2Points = p2.getContributorPoints();

            if (p1Points == p2Points) {
                return 0;
            } else if (p1Points < p2Points) {
                return 1;
            } else {
                return -1;
            }
        });

        List<Person> resultList = new ArrayList();

        if (personList.size() < 10) {
            resultList = personList;
        } else {
            for (int i = 0; i < 10; i++) {
                Person p = resultList.get(i);
                resultList.add(p);
            }
        }

        for (Person p : resultList) {
            p = getPersonById(p.getId());
        }
        return resultList;
    }

    @Override
    public List<Person> getTopTenStreamers() throws NoResultException {
        Query q = em.createQuery("SELECT p FROM Person p");
        List<Person> personList = q.getResultList();

        if (personList.isEmpty()) {
            throw new NoResultException(PersonSessionBeanLocal.EMPTY_PERSON);
        }

        Collections.sort(personList, (Person p1, Person p2) -> {
            double p1Points = p1.getContentCreatorPoints();
            double p2Points = p2.getContentCreatorPoints();

            if (p1Points == p2Points) {
                return 0;
            } else if (p1Points < p2Points) {
                return -1;
            } else {
                return 1;
            }
        });

        List<Person> resultList = new ArrayList();

        for (int i = 0; i < 10; i++) {
            Person p = resultList.get(i);
            resultList.add(p);
        }

        return resultList;
    }

    @Override
    public void checkBadgeQualification(Long personId) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);
        List<Badge> badgeList = badgeSB.getAllBadges();
        List<Badge> personBadgeList = person.getBadges();

        Set<Badge> badgeSet = new HashSet<>(badgeList);
        Set<Badge> personBadgeSet = new HashSet<Badge>(personBadgeList);
        badgeSet.removeAll(personBadgeSet);

        List<Badge> dontHaveBadgeList = new ArrayList();
        dontHaveBadgeList.addAll(badgeSet);

        double ccPoints = person.getContentCreatorPoints();
        double contributorPoints = person.getContributorPoints();
        double totalPoints = ccPoints + contributorPoints;
        int numFollowers = getFollowers(person.getId()).size();
        int numPosts = person.getPosts().size();

        for (Badge b : dontHaveBadgeList) {
            BadgeTypeEnum badgeEnum = b.getBadgeType();
            int pointsRequired = b.getValueRequired();

            switch (badgeEnum) {
                case OVERALL:
                    if (totalPoints >= pointsRequired) {
                        person.getBadges().add(b);
                    }

                case STREAM:
                    if (ccPoints >= pointsRequired * 10) {
                        person.getBadges().add(b);
                    }

                case FOLLOWER:
                    if (numFollowers >= pointsRequired) {
                        person.getBadges().add(b);
                    }

                case POST:
                    if (numPosts >= pointsRequired) {
                        person.getBadges().add(b);
                    }

            }
        }
        em.flush();
    }

    @Override
    public void changeBadge(long personId, long badgeId) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);

        List<Badge> personBadges = person.getBadges();

        boolean hasBadge = false;

        System.out.print(badgeId);

        if (badgeId == 0) {
            person.setBadgeDisplaying(null);
            em.flush();
            return;
        }

        Badge badgeToDisplay = null;

        if (personBadges.isEmpty()) {
            throw new NotValidException(PersonSessionBeanLocal.BADGE_LIST_EMPTY);
        }

        for (Badge b : personBadges) {
            if (b.getId() == badgeId) {
                hasBadge = true;
                badgeToDisplay = b;
            }
        }

        if (!hasBadge) {
            throw new NotValidException(PersonSessionBeanLocal.INVALID_BADGE_SELECTED);
        }
        if (badgeToDisplay != null) {
            person.setBadgeDisplaying(badgeToDisplay);
        } else {
            throw new NotValidException(PersonSessionBeanLocal.UNEXPECTED_ERROR);
        }
    } // end changeBadge

    @Override
    public void banPersonFromLogin(Long personId) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);

        person.setIsBannedFromLogin(true);
        em.flush();

    } // end banPersonFromLogin

    @Override
    public void unbanPersonFromLogin(Long personId) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);

        person.setIsBannedFromLogin(false);
        em.flush();
    } // end unbanPersonFromLogin

    @Override
    public boolean checkPersonBanFromLogin(Long personId) throws NotValidException, NoResultException {
        Person person = emGetPerson(personId);

        return person.isIsBannedFromLogin();
    } // end checkPersonBanFromLogin
}
