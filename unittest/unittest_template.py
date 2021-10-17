"""
To execute the following unit tests, run this command in the terminal from the folder containing this file:
$ python3 -m unittest unittest_template.ProjectTest
"""

import unittest

# import project code

class ProjectTest(unittest.TestCase):
    """
    Explain the purpose of this unittest suite here
    """

    def test_func(self):
        """
        Explain this test
        """
        print('this is a test because the function name starts with test_')

    def not_a_test(self):
        """
        Explain this function
        """
        print('this is not a test')


if __name__ == 'main':
    unittest.main()