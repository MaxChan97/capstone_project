/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.messagingEntities.Chat;
import entity.messagingEntities.Message;
import entity.personEntities.Person;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Max
 */
@Stateless
public class MessageSessionBean implements MessageSessionBeanLocal {
    
    @PersistenceContext
    private EntityManager em;
    
    @Override
    public void addMessageToChat(Long chatId, Long senderId, Long recipientId, Message message) {
        Chat chat = em.find(Chat.class, chatId);
        Person sender = em.find(Person.class, senderId);
        Person recipient = em.find(Person.class, recipientId);
        
        // Linking Message and Person
        message.setSender(sender);
        message.setRecipient(recipient);
        
        // Persisting message
        em.persist(message);
        
        // Linking Chat and Message
        chat.addChatMessage(message);
    }
}
