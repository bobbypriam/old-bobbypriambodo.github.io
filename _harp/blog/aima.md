# Tutorial aima-java untuk searching

Berawal dari minimnya tutorial yang cukup jelas mengenai bagaimana cara menggunakan library aima-java untuk memecahkan masalah searching sederhana (terlebih jika kita meminta penjelasan dalam Bahasa Indonesia), saya akan mencoba membagi pengetahuan yang telah saya peroleh dari berbagai sumber.

Yang akan dibahas di tutorial ini hanya mengenai penggunaan aima-java. Library tersebut juga tersedia dalam bahasa Python (aima-python) tapi tutorial ini tidak akan membahas hal tersebut. Tutorial ini juga  mengasumsikan Anda menggunakan environment command line (bukan IDE), namun seharusnya jika menggunakan IDE seperti Eclipse, konsepnya juga sama.

Tutorial ini saya buat dengan masalah spesifik Tugas 1 mata kuliah Sistem Cerdas tahun akademik 2014/2015 di Fakultas Ilmu Komputer Universitas Indonesia (selanjutnya akan disebut secara singkat "Tugas 1"), namun saya yakin konsep yang diberikan dapat digunakan di masalah-masalah lain.

**Perhatian:** Saya juga masih belajar dan bukan tidak mungkin dalam penjelasan berikut akan ada kesalahan-kesalahan seperti tidak mengikuti *best practice*  dan sebagainya. Jika ingin memberikan komentar perbaikan bisa hubungi saya di `bobby.priambodo(at)gmail.com`.

## What is aima-java?

Library aima-java adalah implementasi algoritma-algoritma yang ada di buku [Artificial Intelligence: A Modern Approach][1] karangan [Norvig][2] dan [Russell][3] dalam bahasa Java.

Library ini menyediakan framework interface-interface yang dapat kita gunakan untuk memecahkan masalah-masalah, di antaranya masalah *state space search* yang menjadi fokus kita di Tugas 1.

## Prerequisite

Sebelum memulai tutorial ini, pastikan:

1. Di komputer Anda sudah ter-install JDK versi 7 atau 8. Jika belum ada, Anda bisa men-download-nya di [sini][4].
2. Anda memiliki pengetahuan pemrograman dengan bahasa Java. Saya tidak akan membahas mengenai sintaks Java di tutorial ini.
3. Anda sudah men-download aima-java versi terbaru di [repository aima-java][5]. Pada waktu penulisan tutorial ini, versi terbaru adalah versi 1.8.0.
4. Anda memiliki pengetahuan mengenai konsep state space search.

## Setting up your workspace

Sudah tidak sabar mulai menulis kode? Tunggu dulu! Ada baiknya kita mempersiapkan struktur hierarki program yang akan kita buat. Struktur ini bermanfaat agar kode kita dapat menjadi lebih rapi.

Sebelumnya, mari kita lihat isi dari file zip yang telah di-download pada bagian *prerequisite*. Extract file tersebut ke sebuah direktori (misalnya `aima-download/`). Susunan direktori di dalamnya adalah sebagai berikut:

	aima-download/
	  aima-core/
	  aima-gui/
	  aimax-osm/
	  release/
	  README.txt

Anda bisa membaca `README.txt` untuk mengetahui penjelasan mengenai kegunaan masing-masing secara lengkap. Singkatnya, untuk membuat sebuah program sendiri, yang anda perlukan adalah direktori `aima-core`.

Masuklah ke direktori `aima-core/src/main/java/` dan copy direktori `aima` beserta isinya ke workspace Anda. Direktori tersebut merupakan root dari package `aima.core.*` yang akan kita gunakan nanti.

Untuk workspace program yang akan kita buat, saya menggunakan struktur sebagai berikut:

	aima/
	{package}/
	  {of}/
	    {problem}/
	      <file-file representasi masalah>.java
	Main.java

File `Main.java` berfungsi sebagai class yang akan menjadi penjalan aplikasi kita, yaitu class yang dipanggil ketika akan menjalankan program melalui command line.

Direktori `aima/` merupakan hasil copy dari direktori `aima-core` pada langkah sebelumnya.

Penamaan dan kedalaman `package/of/problem/` bebas, tapi harus sesuai dengan kode Anda nantinya. Misalkan kita menamakan direktorinya `masalah/robot/`, maka kode-kode di dalamnya harus ada deklarasi

	package masalah.robot;

Struktur dan penamaan ini akan berpengaruh ketika kita ingin meng-`import` kode-kode yang kita perlukan dalam aplikasi kita.

## Necessary implementations

Ini adalah bagian paling penting dalam penggunaan library aima-java. Seperti yang dibilang di atas, aima-java menyediakan interface-interface yang berguna untuk pemecahan masalah. Layaknya sebuah interface, tugas kita adalah menyediakan implementasi-implementasi yang diperlukan agar algoritma searching yang disediakan oleh library tersebut dapat bekerja sesuai yang kita inginkan.

Implementasi-implementasi berikut berada di dalam package masalah Anda (misalnya `masalah/robot/`).

### 1. Problem State Representation

Anda harus membuat sebuah class sebagai representasi state dari problem yang ingin dipecahkan. Class ini bersifat independen terhadap framework; ia tidak perlu menjadi subclass dari apapun. Bisa dibilang class ini merupakan core dari permasalahan kita, tanpanya kita tidak bisa memecahkan masalah.

Implementasi dari representasi state ini bisa sangat beragam, tergantung dari masalah apa yang ingin dipecahkan (bahkan satu masalah dapat memiliki lebih dari satu representasi yang cocok). Untuk Tugas 1, apa saja elemen yang butuh kita simpan? Apakah kita harus menggunakan array dua dimensi atau ada cara lain? Apa saja operasi-operasi yang bisa dilakukan di sebuah state (misalnya menaruh elemen, memindahkan elemen, melakukan pengecekan validitas gerakan)?

**Contoh class:**
`aima.core.environment.nqueens.NQueensBoard`, `aima.core.environment.eightpuzzle.EightPuzzleBoard`.

### 2. Goal Test

Class berikutnya yang harus dibuat adalah implementasi dari interface `aima.core.search.framework.GoalTest`. Class ini harus menyediakan method untuk pengecekan apakah state saat ini sudah merupakan goal state atau belum. Method yang harus diimplementasi adalah

	public boolean isGoalState(Object state);

Seperti Problem State Representation, goal test ini juga tergantung pada masalah yang ingin kita pecahkan. Pada kasus Tugas 1, kapan kita sebut dia sebagai goal state? Bagaimana cara kita tahu semua debu sudah berada di pengki? Semua tergantung pada representasi state yang Anda buat.

**Contoh class:**
`aima.core.environment.nqueens.NQueensGoalTest`, `aima.core.environment.eightpuzzle.EightPuzzleGoalTest`.

### 3. Function Factory

Class ini berguna untuk mendefinisikan Successor Function bagi masalah kita. Seperti yang kita ketahui, Successor Function menerima sebuah state dan mengembalikan himpunan pair dari action dan state hasil.

Dengan aima-java, FunctionFactory menjadi representasi Successor Function dengan memiliki dua inner class, yaitu ActionsFunction dan ResultFunction, serta method getter untuk mengambil keduanya.

#### 3. a. ActionsFunction

Class ini mengimplementasikan interface `aima.core.search.framework.ActionsFunction`. Method yang harus diimplementasi di class ini adalah

	public Set<Action> actions(Object state);

Method `actions` menerima sebuah state dan mengembalikan *possible actions* yang mungkin dilakukan agent dari state tersebut. Artinya, di method tersebut kita dapat melakukan pengecekan mana action yang valid dan tidak, dan sebagainya.

#### 3. b. ResultFunction

Class ini mengimplementasikan interface aima.core.search.framework.ResultFunction. Method yang harus diimplementasi di class ini adalah

	public Object result(Object s, Action a);

Method `result` menerima sebuah state serta action yang dilakukan, dan mengembalikan state hasil. Di sini kita dapat berasumsi bahwa `a` adalah action yang valid, karena pengecekan sudah dilakukan oleh `ActionsFunction`. Kita cukup men-generate board baru dan menempatkan elemen-elemen sesuai dengan action yang dilakukan.

**Jangan melakukan perubahan pada state awal `s`!** State awal akan dipakai dalam ekspansi node yang lain, dan kita harus memastikan ia masih seperti sedia kala. Karena Java menggunakan `call by reference` untuk object, maka perubahan dapat mengubah object aslinya.

**Contoh class:**
`aima.core.environment.nqueens.NQueensFunctionFactory`, `aima.core.environment.eightpuzzle.EightPuzzleFunctionFactory`.

### 4. Heuristic Function

Class ini diperlukan jika kita ingin menggunakan informed search, seperti A* (AStar). Class ini mengimplementasi interface `aima.core.search.framework.HeuristicFunction`. Method yang harus diimplementasi adalah

	public double h(Object state);

Method ini menerima sebuah state dan mengembalikan hasil perhitungan *heuristic function*-nya. Implementasinya tergantung *heuristic function* yang ingin Anda pakai, yang juga tergantung dari masalah apa yang ingin Anda selesaikan.

**Contoh class:**
`aima.core.environment.nqueens.AttackingPairsHeuristic`, `aima.core.environment.eightpuzzle.ManhattanHeuristicFunction`, `aima.core.environment.eightpuzzle.MisplacedTilleHeuristicFunction`.

### 5. Problem Solver

Dokumentasi (minim) aima-java tidak menyertakan hal ini, tapi saya pikir class ini penting untuk *benar-benar* menjalankan algoritma searching.

Implementasi class ini tidak memiliki panduan khusus karena ia tak harus mengimplementasi interface apa pun. Pada intinya ia harus menyediakan method-method searching untuk algoritma tertentu (IDS, A*, BFS, dan sebagainya), serta bisa memanggil method searching pada sebuah problem yang sesuai dengan algoritma yang diinginkan.

**Beberapa class yang bisa jadi referensi untuk implementasi (ada di `aima-gui`):**
`aima.gui.demo.search.NQueensDemo`, `aima.gui.demo.search.EightPuzzleDemo`.

### 6. (Optional) Dynamic Action

DynamicAction adalah sebuah class yang bisa menyimpan action yang memiliki atribut yang dapat berubah. Kita dapat membuat class yang menjadi subclass `aima.core.agent.impl.DynamicAction`, atau cukup menggunakan DynamicAction secara langsung.

**Contoh class yang meng-extends DynamicAction:**
`aima.core.environment.nqueens.QueenAction`.

Untuk contoh yang langsung menggunakan `DynamicAction` (tanpa subclass), Anda bisa melihat implementasi `EightPuzzleFunctionFactory`, sedangkan yang tidak langsung Anda bisa melihat implementasi `NQueensFunctionFactory`.

## Main.java implementation

Untuk implementasi Main.java cukup *straightforward*. Anda bisa melakukan penerimaan input yang diperlukan dan sebagainya. Beberapa hal penting, di class ini Anda melakukan inisialisasi class representasi state yang telah Anda buat pada bagian *necessary implementations*, mendefinisikan initial state dengan menempatkan elemen-elemen, serta melakukan pemanggilan method search dari class problem solver yang juga telah dibuat sebelumnya.

## Compiling and running

Jika implementasinya sudah benar, maka untuk meng-*compile* program Anda, silakan lakukan

	$ javac Main.java masalah/robot/*.java

Perintah tersebut akan meng-*compile* semua file .java yang dibutuhkan beserta dependensinya. Kemudian Anda cukup memanggil (dengan tambahan argumen jika diperlukan)

	$ java Main <args0> <args1> ...

Selamat! Anda telah berhasil membuat program solusi untuk searching dengan menggunakan aima-java.

## Clarifications

Tutorial ini meminta Anda untuk menyalin direktori source code package `aima.core.*` ke workspace Anda. Sebenarnya, dalam zip yang diperoleh ketika Anda men-download aima-java, terdapat file `aima-core.jar` di direktori `release/` yang merupakan file-file .class yang sudah dibungkus menjadi satu dan seharusnya bisa langsung dipakai. Namun saya masih belum berhasil menggunakannya jika melalui command line (saya sudah mencoba menggunakan javac dengan option `-cp ".:aima-core.jar:"` dengan berbagai macam kombinasi). Tutorial ini akan di-update segera setelah saya menemukan caranya.

Tahu caranya? Hubungi saya di `bobby.priambodo(at)gmail.com`. Saya akan mencantumkan nama Anda sebagai kontributor.

## Final note

Terima kasih sudah mengikuti tutorial ini sampai akhir. Jika ada kritik atau saran, silakan sampaikan ke saya melalui email yang tertera di atas.

[1]: http://aima.cs.berkeley.edu
[2]: http://www.norvig.com
[3]: http://www.cs.berkeley.edu/~russell
[4]: http://www.oracle.com/technetwork/java/javase/downloads
[5]: https://code.google.com/p/aima-java