import $ from 'jquery';
import io from 'socket.io-client';

export default function handleChat($chat, roomId) {
  const socket = io('/room', { transports: ['websocket'] });

  socket.emit('join', roomId);

  const $input = $('.chat-input');
  const $submit = $('.chat-submit');

  $submit.click(() => {
    const message = $input.val();

    $input.val('');

    socket.emit('newMessage', roomId, message);

    return false;
  });

  socket.on('message', (messageObj) => {
    const $message = $('<div class="chat-message"><time></time><span></span></div>');

    $message.find('span').text(messageObj.text);
    $message.find('time').text(messageObj.createdAt);

    $message.prependTo($chat);
  });
}
