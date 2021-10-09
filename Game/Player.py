"""
This is the Player class, used to define each user of the game.
"""
from uuid import uuid4

class Player():

    def __init__(self, name):
        """
        Initialize the player
        """
        self.name = name
        self.score = 0
        self.uid = uuid4().hex # Create a unique identifier

    def add_points(self, points):
        """
        Add a specified number of points to the player's score
        """
        self.score += points

    def subtract_points(self, points):
        """
        Remove a specified number of points from the player's score
        """
        self.score -= points

    def reset_player(self):
        """
        Reset the player to the initial state
        """
        self.score = 0
        self.is_curr_player = False