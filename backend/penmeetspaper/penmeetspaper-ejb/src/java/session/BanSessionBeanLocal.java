/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Ban;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.Local;

/**
 *
 * @author shawn
 */
@Local
public interface BanSessionBeanLocal {

    public final static String PERSON_ALREADY_BANNED = "Person has already been banned";
    public final static String PERSON_NOT_BANNED = "Person not in ban list";

    public final static String MISSING_PERSON_ID = "Missing person id";
    public final static String MISSING_COMMUNITY_ID = "Missing community id";

    public final static String CANNOT_FIND_COMMUNITY = "Cannot find community";
    public final static String CANNOT_FIND_PERSON = "Cannot find person";

    public void addCommuntiyBan(Long communityId, Long personId) throws NoResultException, NotValidException;

    public void removeCommuntiyBan(Long communityId, Long personId) throws NoResultException, NotValidException;

    public void addPersonBan(Long personBanningId, Long personToBanId) throws NoResultException, NotValidException;

    public void removePersonBan(Long personBanningId, Long personToUnBanId) throws NoResultException, NotValidException;

    public Ban createBan();

    public Ban getDetachedBan(Long banId) throws NoResultException, NotValidException;

}
