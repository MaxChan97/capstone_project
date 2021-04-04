/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LiveChat;
import entity.Stream;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface StreamSessionBeanLocal {
    
    public Stream createStream(Long streamerId, String streamTitle, String streamDescription, Boolean isPaid, String accessUrl, String thumbnailUrl) throws NoResultException, NotValidException;
    
    public void endStream(Long streamId);
    
    public Stream getStreamById(Long streamId) throws NoResultException, NotValidException;
    
    public LiveChat getLiveChatByStreamId(Long streamId) throws NoResultException, NotValidException;
    
    public void sendLiveChatMessage(Long streamId, Long senderId, String messageBody);
    
    public List<Stream> getOngoingStreams() throws NoResultException, NotValidException;
    
    public List<Stream> getPersonOngoingStreams(Long personId) throws NoResultException, NotValidException;
    
    public void editStreamInfo(Long streamId, String newStreamTitle, String newStreamDescription);
}
