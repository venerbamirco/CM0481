#include <random>
#include <iostream>

using namespace std;

unsigned long long fib(int n) {
	long a = 0, b = 1, c, i;
	
  if( n == 0)
		return a;
	
  for(i = 2; i <= n; i++){
	  c = a + b;
	  a = b;
	  b = c;
	}

	return b;
}


int main() {
  std::random_device dev;
  std::mt19937 rng(dev());
  std::uniform_int_distribution<std::mt19937::result_type> dist100(1, 100);

  long n = dist100(rng);

  for (int i = 0; i <= n; i++) {
	  cout << "fib(" << i << ") = " << fib(i) << std::endl;
  }
	
  return 0;
}