/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Advertisement;
import exception.NoResultException;
import exception.NotValidException;
import java.util.Date;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author User
 */
@Stateless
public class AdvertisementSessionBean implements AdvertisementSessionBeanLocal {

    @PersistenceContext
    EntityManager em;

    private Advertisement emGetAd(Long aId) throws NoResultException, NotValidException {
        if (aId == null) {
            throw new NotValidException(AdvertisementSessionBeanLocal.MISSING_AD_ID);
        }

        Advertisement ad = em.find(Advertisement.class, aId);

        if (ad == null) {
            throw new NoResultException(AdvertisementSessionBeanLocal.CANNOT_FIND_AD);
        }

        return ad;
    }

    @Override
    public void createAdvertisement(Advertisement ad) {
        ad.setDatePosted(new Date());
        em.persist(ad);
        em.flush();
    }

    @Override
    public List<Advertisement> getAllAdvertisement() {
        Query q = em.createQuery("SELECT a FROM Advertisement a");
        List<Advertisement> adList = q.getResultList();
        return adList;
    }

    @Override
    public Advertisement getAdById(Long adId) throws NoResultException, NotValidException {
        Advertisement ad = emGetAd(adId);
        return ad;
    }

    @Override
    public void deleteAd(Long adId) throws NoResultException, NotValidException {
        Advertisement ad = emGetAd(adId);
        em.remove(ad);
    }

}
