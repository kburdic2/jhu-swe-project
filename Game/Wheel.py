import os
import pygame as pg
from pygame.math import Vector2

class Wheel():
    angles = {'green': 0, 'yellow': 300, 'blue': 240, 'orange': 180, 'grey': 120, 'red': 60}
    categories = ["Nature", "Pop Music", "Sports", "Food & Drink", "Physics", "Art"]

    def __init__(self, x, y):
        self.angle = 0
        self.spinner_count = 0

        # Get path to wheel image for loading
        wheelImage = "UI\\Wheel.png"
        base_path = os.path.dirname(__file__)
        wheel_path = os.path.join(base_path, wheelImage)
        self.image = pg.image.load(wheel_path)

        self.image_rect = self.image.get_rect(center = (x, y))
        self.center = (x, y)
        self.x = x
        self.y = y

    def rotate(self, surface, angle, pivot, offset):
        rotated_image = pg.transform.rotozoom(surface, angle, 2)
        rotated_offset = offset.rotate(angle)
        rect = rotated_image.get_rect(center=pivot+rotated_offset)

        return [rotated_image, rect]

    def spinTo(self, color):
        if abs(self.angle) % 360 != self.angles[color] or self.spinner_count < 150:
            self.spinner_count += 1
            remaining_angle = (abs(self.angle) % 360) - self.angles[color]
            if self.spinner_count > 150:
                if remaining_angle > 360:
                    self.angle -= 4
                elif remaining_angle > 180:
                    self.angle -= 3
                elif remaining_angle > 10:
                    self.angle -= 2
                else:
                    self.angle -= 1
            else:
                self.angle -= (10 - (self.spinner_count//25))

        font = pg.font.SysFont("monospace", 22)
        categoryLabels = []
        for index, category in enumerate(self.categories):
            label = font.render(category, 1, (0, 0, 0))
            color_angles = list(self.angles.values())
            pivoted_label = self.rotate(label, -color_angles[index], Vector2(self.center), Vector2(300, 0))
            rotated_label = pg.transform.rotozoom(pivoted_label[0], -color_angles[index]+(-180*(index%2)), 1)
            categoryLabels.append([rotated_label, pivoted_label[1]])

        return self.rotate(self.image, self.angle, Vector2(self.center), Vector2(0,0)), categoryLabels
