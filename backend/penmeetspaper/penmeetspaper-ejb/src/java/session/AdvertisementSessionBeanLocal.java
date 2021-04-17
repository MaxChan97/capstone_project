/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Advertisement;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Shawn
 */
@Local
public interface AdvertisementSessionBeanLocal {

    public final static String MISSING_AD_ID = "Missing Ad Id";
    public final static String CANNOT_FIND_AD = "Cannot find Ad";

    public void deleteAd(Long adId) throws NoResultException, NotValidException;

    public void createAdvertisement(Advertisement ad);

    public List<Advertisement> getAllAdvertisement();

    public Advertisement getAdById(Long adId) throws NoResultException, NotValidException;

}
