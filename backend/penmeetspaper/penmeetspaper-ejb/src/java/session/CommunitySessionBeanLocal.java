/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import entity.personEntities.Person;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Shawn
 */
@Local
public interface CommunitySessionBeanLocal {

    public final static String NAME_TAKEN = "Community Name taken";
    public final static String MISSING_COMMUNITY = "Missing Community parameter";
    public final static String MISSING_COMMUNITY_ID = "Missing Community parameter";
    public final static String MISSING_NAME = "Missing community name";
    public final static String MISSING_PERSON_ID = "Missing Person ID parameter";
    public final static String INVALID_CREDENTIALS = "Invalid credentials";

    public final static String INVALID_OWNER = "Owner is invalid";
    public final static String CANNOT_FIND_COMMUNITY = "Could not find community";
    public final static String CANNOT_FIND_PERSON = "Could not find person";

    public final static String ALREADY_FOLLOWING = "Person already following community";
    public final static String ALREADY_UNFOLLOWING = "Person already unfollowed community";
    public final static String ALREADY_BANNED = "Person already banned";

    public final static String BANNED = "You are banned from the community";
    public final static String CANNOT_BAN_OWNER = "The owner of the community cannot be banned";

    public Community createCommunity(Community community, Long ownerId) throws NotValidException, NoResultException;

    public List<Community> searchCommunityByName(String name);

    public Community getCommunityById(Long communityId) throws NoResultException, NotValidException;

    public void followCommunity(Long communityId, Long personId) throws NoResultException, NotValidException;

    public void unfollowCommunity(Long communityId, Long personId) throws NoResultException, NotValidException;

    public void updateCommunity(Community community) throws NoResultException, NotValidException;

    public List<Person> getMembers(Long communityId) throws NoResultException, NotValidException;

    public void banPerson(Long communityId, Long personId, Long ownerId) throws NoResultException, NotValidException;

    public void checkBanned(Long communityId, Long personId) throws NotValidException, NoResultException;

    public Community getCommunity(Long communityId, Long personId) throws NoResultException, NotValidException;

}
