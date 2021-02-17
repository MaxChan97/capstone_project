/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Community;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author Shawn
 */
@Local
public interface CommunitySessionBeanLocal {

    public final static String NAME_TAKEN = "Community Name taken";
    public final static String MISSING_COMMUNITY = "Missing Community parameter";
    public final static String MISSING_NAME = "Missing community name";
    public final static String INVALID_OWNER = "Owner is invalid";

    public Community createCommunity(Community community) throws NotValidException;

}
