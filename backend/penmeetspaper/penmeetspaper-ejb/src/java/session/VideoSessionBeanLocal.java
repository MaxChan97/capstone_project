/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Video;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author carlc
 */
@Local
public interface VideoSessionBeanLocal {

    public final static String MISSING_VIDEO = "Missing video";
    public final static String MISSING_PERSON_ID = "Missing person ID";
    public final static String CANNOT_FIND_PERSON = "Could not find person";
    public final static String CANNOT_FIND_VIDEO = "Could not find video";

    public void createVideoForPerson(Long personId, Video video) throws NoResultException, NotValidException;

    public List<Video> getPersonsVideos(Long personId) throws NoResultException, NotValidException;

    public Video getVideo(Long videoId) throws NoResultException, NotValidException;

    public List<Video> getAllVideos() throws NoResultException, NotValidException;
    
    public List<Video> getVideosByTrend(String hashtag) throws NoResultException, NotValidException;

    public List<Video> searchVideoByTitleAndDescription(String searchString) throws NoResultException, NotValidException;
    public void addView(Long videoId);

}
