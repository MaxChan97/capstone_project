/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.messagingEntities.Chat;
import entity.messagingEntities.Message;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface ChatSessionBeanLocal {

    public Chat createChat(Long person1Id, Long person2Id, Message message);

    public List<Chat> getPersonsChat(Long personId);
    
}
