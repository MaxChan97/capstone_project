/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Chat;
import entity.Message;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Max
 */
@Local
public interface ChatSessionBeanLocal {

    public Chat createChat(Long senderId, Long recipientId, Message message) throws NoResultException, NotValidException;

    public List<Chat> getPersonsChat(Long personId) throws NoResultException, NotValidException;

    public void setAllMessagesAsOpened(Long chatId);

}
