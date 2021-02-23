/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
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

    public final static String INVALID_OWNER = "Owner is invalid";
    public final static String CANNOT_FIND_COMMUNITY = "Could not find community";
    public final static String CANNOT_FIND_PERSON = "Could not find person";

    public Community createCommunity(Community community) throws NotValidException;

    public List<Community> searchCommunityByName(String name);

    public void updateCommunity(Community community) throws NoResultException, NotValidException;

    public Community getCommunityById(Long communityId) throws NoResultException, NotValidException;

}
