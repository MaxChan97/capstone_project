/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.LiveChat;
import entity.LivePoll;
import entity.Stream;
import enumeration.TopicEnum;
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

    public Stream createStream(Long streamerId, String streamTitle, String streamDescription, Boolean isPaid, String accessUrl, String thumbnailUrl, List<TopicEnum> relatedTopics) throws NoResultException, NotValidException;

    public void addLivePollToStream(Long streamId, LivePoll livePoll);

    public void endLivePoll(Long livePollId);

    public void endStream(Long streamId);

    public Stream getStreamById(Long streamId) throws NoResultException, NotValidException;
    
    public List<Stream> getStreamsByTrend(String hashtag) throws NoResultException, NotValidException;

    public LivePoll getActiveLivePollByStreamId(Long streamId) throws NoResultException, NotValidException;

    public LiveChat getLiveChatByStreamId(Long streamId) throws NoResultException, NotValidException;

    public void sendLiveChatMessage(Long streamId, Long senderId, String messageBody);

    public List<Stream> getOngoingStreams() throws NoResultException, NotValidException;

    public List<Stream> getPersonOngoingStreams(Long personId) throws NoResultException, NotValidException;

    public void editStreamInfo(Long streamId, String newStreamTitle, String newStreamDescription, List<TopicEnum> relatedTopics);

    public void handleEnterStream(Long streamId, Long personId);

    public void handleExitStream(Long streamId, Long personId);

    public void kickUserFromStream(Long streamId, Long personId);

    public void unkickUserFromStream(Long streamId, Long personId);
    
    public List<Stream> searchStreamByTitleAndDescription(String searchString) throws NoResultException, NotValidException;
}
