-- Initial learning roadmap
INSERT INTO topics (slug, title, category, summary, order_index) VALUES
('linux',          'Linux Fundamentals',            'FUNDAMENTALS', 'File system, users and permissions, processes, logs, the command line.', 1),
('network',        'Networking Fundamentals',               'FUNDAMENTALS', 'OSI/TCP-IP, IPs and ports, TCP/UDP, DNS, HTTP, the journey of a web request.', 2),
('crypto',         'Cryptography Fundamentals',      'CRYPTO',       'Encoding vs. encryption vs. hashing, password storage, TLS, certificates.', 3),
('security-101',   'Security Fundamentals',       'FUNDAMENTALS', 'The CIA triad, least privilege, defense in depth, common threat types.', 4),
('web-security',   'Web Security',              'WEB',          'OWASP Top 10 categories, secure coding principles, Burp Suite basics.', 5),
('wstg',           'Web Testing Methodology',      'WEB',          'A systematic, authorized testing process with the OWASP WSTG.', 6),
('secure-java',    'Secure Code (Java/Spring)',  'WEB',          'Spring Security, input validation, secure configuration, dependency management.', 7),
('dvwa-lab',       'DVWA Lab',                   'PRACTICE',     'Local lab: compare each level''s source code with the "Impossible" level.', 8),
('bug-bounty',     'Intro to Bug Bounty',          'PRACTICE',     'Hacker101, responsible disclosure, scope rules.', 9),
('blue-team',      'Defense (Blue Team)',       'DEFENSE',      'Log analysis, SIEM, the incident response cycle, MITRE ATT&CK.', 10);

INSERT INTO study_resources (topic_id, title, url, kind)
SELECT t.id, r.title, r.url, r.kind
FROM (VALUES
  ('linux',        'OverTheWire Bandit (Level 0-15)',            'https://overthewire.org/wargames/bandit/',                         'LAB'),
  ('linux',        'TryHackMe — Linux Fundamentals 1-3',         'https://tryhackme.com/module/linux-fundamentals',                  'COURSE'),
  ('network',      'TryHackMe — Pre Security path',              'https://tryhackme.com/path/outline/presecurity',                    'COURSE'),
  ('network',      'Professor Messer — Security+ videos',     'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/', 'VIDEO'),
  ('crypto',       'CryptoHack — Introduction',                  'https://cryptohack.org/courses/',                                   'LAB'),
  ('crypto',       'Dan Boneh — Cryptography I',                 'https://www.coursera.org/learn/crypto',                             'COURSE'),
  ('crypto',       'OWASP Password Storage Cheat Sheet',         'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html', 'DOC'),
  ('security-101', 'TryHackMe — Cyber Security 101 path',        'https://tryhackme.com/path/outline/cybersecurity101',               'COURSE'),
  ('web-security', 'PortSwigger Web Security Academy',           'https://portswigger.net/web-security/learning-paths',               'COURSE'),
  ('web-security', 'OWASP Top 10',                               'https://owasp.org/www-project-top-ten/',                            'DOC'),
  ('wstg',         'OWASP Web Security Testing Guide',           'https://owasp.org/www-project-web-security-testing-guide/',         'DOC'),
  ('secure-java',  'OWASP Cheat Sheet Series',                   'https://cheatsheetseries.owasp.org/',                               'DOC'),
  ('secure-java',  'Spring Security Reference',                  'https://docs.spring.io/spring-security/reference/',                 'DOC'),
  ('dvwa-lab',     'DVWA (local: labs/dvwa)',                    'http://127.0.0.1:4280',                                             'LAB'),
  ('bug-bounty',   'Hacker101',                                  'https://www.hacker101.com/',                                        'COURSE'),
  ('blue-team',    'TryHackMe — SOC Level 1',                    'https://tryhackme.com/path/outline/soclevel1',                      'COURSE'),
  ('blue-team',    'MITRE ATT&CK',                               'https://attack.mitre.org/',                                         'DOC'),
  ('blue-team',    'LetsDefend',                                 'https://letsdefend.io/',                                            'LAB')
) AS r(slug, title, url, kind)
JOIN topics t ON t.slug = r.slug;

-- Concept questions (multiple choice)
CREATE TEMP TABLE seed_q (
    seq INT, slug TEXT, prompt TEXT, correct_index INT, explanation TEXT, opts TEXT[]
);
INSERT INTO seed_q VALUES
(1, 'linux', 'What are the permissions after `chmod 640 file`?', 1,
   '6 = rw (owner), 4 = r (group), 0 = nothing (others).',
   ARRAY['rwxr-----','rw-r-----','rw-rw-r--','r--r-----']),
(2, 'linux', 'What is the main reason to run a service as its own restricted user instead of root?', 2,
   'Least privilege: if the service is compromised, the attacker only gets that user''s permissions.',
   ARRAY['It runs faster','Log files get smaller','Damage stays limited if it is compromised (least privilege)','It can open ports']),
(3, 'linux', 'Where do you usually look for failed SSH login attempts on a Linux server?', 0,
   'On Debian/Ubuntu, authentication events are kept in /var/log/auth.log (or journalctl -u ssh).',
   ARRAY['/var/log/auth.log','/etc/passwd','/tmp','/usr/bin']),
(4, 'network', 'Why do DNS queries usually use UDP?', 1,
   'Queries and answers are usually small, so the extra round trip of a TCP handshake is not needed. Large answers fall back to TCP.',
   ARRAY['Because UDP is encrypted','To avoid connection setup cost for small, fast request/response exchanges','Because UDP guarantees reliable delivery','Because firewalls block TCP']),
(5, 'network', 'Which of these is a private IP address?', 2,
   '192.168.0.0/16, 10.0.0.0/8 and 172.16.0.0/12 are private ranges and are not routed on the internet.',
   ARRAY['8.8.8.8','1.1.1.1','192.168.1.20','93.184.216.34']),
(6, 'network', 'What is the correct order of the TCP three-way handshake?', 0,
   'The client sends SYN, the server replies with SYN-ACK, and the client completes the connection with ACK.',
   ARRAY['SYN → SYN-ACK → ACK','ACK → SYN → FIN','SYN → ACK → RST','HELLO → KEY → DONE']),
(7, 'crypto', 'Which statement about Base64 is true?', 3,
   'Base64 is an encoding: anyone can reverse it without a key. It provides no confidentiality.',
   ARRAY['It is a symmetric encryption algorithm','It is a one-way hash function','It is suitable for storing passwords','It is an encoding that can be reversed without a key']),
(8, 'crypto', 'What is the best option for storing passwords?', 2,
   'Password hashing uses slow, salted algorithms (Argon2id, bcrypt); fast hashes are open to brute force.',
   ARRAY['Encrypt them with AES','Hash them with SHA-256','Hash them with Argon2id or bcrypt','Encode them with Base64']),
(9, 'crypto', 'Which statement about a salt is true?', 1,
   'A salt is a random per-user value; it makes identical passwords produce different hashes and defeats precomputed tables. It does not need to be secret.',
   ARRAY['It is a master key that must be kept secret','It is a random value that makes identical passwords hash differently','It must be the same for all users','It is only used during decryption']),
(10, 'security-101', 'What does the "I" (Integrity) in the CIA triad mean?', 1,
   'Integrity means data is not modified without authorization.',
   ARRAY['Only authorized people can see the data','Data is not changed without permission','The system is always available','The user''s identity is verified']),
(11, 'security-101', 'What does "defense in depth" mean?', 0,
   'Using several independent layers of protection instead of relying on a single control.',
   ARRAY['Using several independent security layers','Using only a strong firewall','Putting all systems on one network','Using only antivirus']),
(12, 'web-security', 'Which statement about form validation in the frontend is true?', 2,
   'The client is under the user''s control and requests can be sent directly. Validation must always be repeated on the server.',
   ARRAY['It is enough for security on its own','It makes server-side validation unnecessary','It is for user experience; server-side validation is still required','It is enough when combined with HTTPS']),
(13, 'web-security', 'What is the main security benefit of parameterized queries (PreparedStatement)?', 1,
   'User data is sent separately from the query structure, so it is never interpreted as a command.',
   ARRAY['They make queries faster','They prevent user input from being interpreted as part of the query','They encrypt the data','They manage the connection pool']),
(14, 'secure-java', 'How should a Spring app ensure users can only access their own records?', 3,
   'Authorization must be checked on the server for every request, against the signed-in user; identity data sent by the client is not trusted.',
   ARRAY['By hiding the button in the frontend','By making IDs unguessable (enough on its own)','By trusting the userId parameter in the request','By comparing the record owner with the signed-in user on the server for every request']),
(15, 'blue-team', 'In the incident response cycle, which step usually comes right after "Detection"?', 2,
   'Preparation → Detection/Analysis → Containment → Eradication → Recovery → Lessons learned.',
   ARRAY['Lessons learned','Recovery','Containment','Preparation']);

INSERT INTO questions (topic_id, prompt, kind, correct_index, explanation, source)
SELECT t.id, q.prompt, 'MULTIPLE_CHOICE', q.correct_index, q.explanation, 'SEED'
FROM seed_q q JOIN topics t ON t.slug = q.slug
ORDER BY q.seq;

INSERT INTO question_options (question_id, position, text)
SELECT qu.id, o.pos - 1, o.txt
FROM seed_q q
JOIN topics t ON t.slug = q.slug
JOIN questions qu ON qu.topic_id = t.id AND qu.prompt = q.prompt
CROSS JOIN LATERAL unnest(q.opts) WITH ORDINALITY AS o(txt, pos);

-- Open-ended questions (graded via the MCP server)
INSERT INTO questions (topic_id, prompt, kind, explanation, source)
SELECT t.id, q.prompt, 'OPEN', q.explanation, 'SEED'
FROM (VALUES
  ('network',      'What happens step by step when you type https://example.com into the browser? Describe everything from DNS to the rendered page.',
                   'Expected: DNS resolution, TCP handshake, TLS handshake and certificate validation, encrypted HTTP request/response.'),
  ('crypto',       'Explain the difference between encoding, encryption and hashing in your own words and give an example of each.',
                   'Expected: encoding is reversible without a key (Base64), encryption is reversible with a key (AES), hashing is one-way (SHA-256, bcrypt).'),
  ('security-101', 'Explain the principle of least privilege with an example from a project you built.',
                   'Expected: users/services/DB accounts get only the permissions they need, with a concrete example.')
) AS q(slug, prompt, explanation)
JOIN topics t ON t.slug = q.slug;

-- Sample tasks
INSERT INTO tasks (topic_id, title, due_date)
SELECT t.id, x.title, CURRENT_DATE + x.days
FROM (VALUES
  ('linux',   'Bandit Level 0-5',                          0),
  ('linux',   'Linux note: file permissions and SUID',         2),
  ('network', 'Find DNS and TLS in my own traffic with Wireshark', 5)
) AS x(slug, title, days)
JOIN topics t ON t.slug = x.slug;

UPDATE topics SET status = 'IN_PROGRESS', started_at = now() WHERE slug = 'linux';
