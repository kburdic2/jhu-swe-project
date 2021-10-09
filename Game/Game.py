"""
This is the Game class
"""

import sys
import random
import pygame as pg
from Wheel import Wheel
from Player import Player

class Game():

    questions = {
        'Category 1': [
            # Format: [Question, Answer, Options (Including Answer)]
            ['Question 1', 'Answer', ['Option 1', 'Option 2', 'Option 3', 'Option 4']],
            ['Question 2', 'Answer', ['Option 1', 'Option 2', 'Option 3', 'Option 4']]
        ],
        'Category 2': [
            # Format: [Question, Answer, Options (Including Answer)]
            ['Question 1', 'Answer', ['Option 1', 'Option 2', 'Option 3', 'Option 4']],
            ['Question 2', 'Answer', ['Option 1', 'Option 2', 'Option 3', 'Option 4']]
        ]
    }

    def __init__(self, players):
        """
        Initialize the game
        """
        self.players = players

    def pickQuestion(self, category):
        """
        Randomly pick a question

        :param category: The category to select a question from
        :return question text, answer text, randomized list of options
        """
        try:
            pickedQuestion = random.choice(self.questions[category])
            return pickedQuestion[0], pickedQuestion[1], random.shuffle(pickedQuestion[2])
        except (KeyError, IndexError):
            print('Error: Invalid category selected')
            return None

    def reset_game(self):
        """
        Reset the game to the initial state
        """
        for player in self.players:
            player.reset_player()

def main():
    pg.init()
    clock = pg.time.Clock()
    screen = pg.display.set_mode([0, 0], pg.FULLSCREEN)
    x, y = screen.get_size()
    wheel = Wheel(x/2, y/2)

    plr = Player("Player1")
    print(plr.uid)
    
    while True:
        for event in pg.event.get():
            if event.type == pg.QUIT:
                pg.quit()
                sys.exit()
        
        rotated_wheel, categories = wheel.spinTo('red')

        font = pg.font.SysFont("monospace", 15)
        label1 = font.render("Angle: " + str(wheel.angle), 1, (0, 0, 0))
        label2 = font.render("Spinner Count: " + str(wheel.spinner_count), 1, (0, 0, 0))

        screen.fill((255, 255, 255))
        screen.blit(rotated_wheel[0], rotated_wheel[1])
        screen.blit(label1, (500, 100))
        screen.blit(label2, (500, 150))
        for category in categories:
            screen.blit(category[0], category[1])
        pg.display.flip()
        clock.tick(30)

if __name__ == "__main__":
    main()