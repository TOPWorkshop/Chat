/* global jQuery, io */

(function onLoad($) {
  function handleChat(roomId) {
    const socket = io('/room', { transports: ['websocket'] });

    socket.emit('join', roomId);

    const $chat = $('.chat');
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

  $(() => {
    const $chat = $('.chat');

    if ($chat.length > 0) {
      const roomId = $chat.data('roomId');

      handleChat(roomId);
    }
  });
}(jQuery));
